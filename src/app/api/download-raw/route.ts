import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
    }

    // Fetch the video from RedNote
    const response = await fetch(videoUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to download raw video: ${response.statusText}`);
    }

    // Pipe the response directly back to the client as a stream!
    // This is super fast and bypasses any memory limits
    return new NextResponse(response.body, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="xiaosave-480p.mp4"`,
      },
    });

  } catch (error: any) {
    console.error("Raw download error:", error);
    return NextResponse.json(
      { error: "Failed to download video: " + error.message },
      { status: 500 }
    );
  }
}
