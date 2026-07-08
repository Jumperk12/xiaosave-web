import { NextResponse } from "next/server";

// Utility function to extract just the URL from messy clipboard text
function extractValidUrl(text: string): string | null {
  const urlRegex = /(https?:\/\/[^\s]+)/;
  const match = text.match(urlRegex);
  return match ? match[1] : null;
}

export async function POST(request: Request) {
  try {
    const { url: rawInput } = await request.json();

    if (!rawInput) {
      return NextResponse.json({ error: "No input provided" }, { status: 400 });
    }

    const cleanUrl = extractValidUrl(rawInput);

    if (!cleanUrl) {
      return NextResponse.json(
        { error: "Could not find a valid RedNote link in your text. Please paste a valid URL." },
        { status: 400 }
      );
    }

    // 1. Fetch the RedNote URL pretending to be a mobile device
    const response = await fetch(cleanUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from RedNote" },
        { status: 500 }
      );
    }

    const html = await response.text();

    // 2. Regex to find the hidden video URL ("masterUrl")
    const masterUrlMatch = html.match(/"masterUrl"\s*:\s*"([^"]+)"/);

    if (masterUrlMatch && masterUrlMatch[1]) {
      // Clean up any unicode slashes (e.g., \u002F -> /)
      const cleanUrl = masterUrlMatch[1].replace(/\\u002F/g, '/');
      return NextResponse.json({ success: true, masterUrl: cleanUrl });
    }

    return NextResponse.json(
      { error: "Could not find video URL. This link might be a photo post, or RedNote changed their format." },
      { status: 404 }
    );

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
