export const maxDuration = 60;
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// Manually point fluent-ffmpeg to the physical location of the standalone binary
const ffmpegPath = path.join(process.cwd(), "node_modules", "ffmpeg-static", "ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

export async function POST(request: Request) {
  let tempInputPath = "";
  let tempOutputPath = "";

  try {
    const { videoUrl } = await request.json();

    if (!videoUrl) {
      return NextResponse.json({ error: "No video URL provided" }, { status: 400 });
    }

    // 1. Setup temporary file paths
    const tempDir = os.tmpdir();
    const uniqueId = Date.now().toString();
    tempInputPath = path.join(tempDir, `input-audio-${uniqueId}.mp4`);
    tempOutputPath = path.join(tempDir, `output-audio-${uniqueId}.mp3`);

    // 2. Download the raw video
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download raw video: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempInputPath, buffer);

    // 3. Process with FFmpeg to extract ONLY the audio as an MP3
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .noVideo() // This drops the video stream entirely
        .audioCodec('libmp3lame') // Ensures it exports as a high-quality MP3
        .on("end", () => resolve(true))
        .on("error", (err) => reject(err))
        .save(tempOutputPath);
    });

    // 4. Read the freshly created MP3
    const processedAudioBuffer = fs.readFileSync(tempOutputPath);

    // 5. Send the MP3 back to the client
    return new NextResponse(processedAudioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="xiaosave-audio-${uniqueId}.mp3"`,
      },
    });

  } catch (error: any) {
    console.error("Audio processing error:", error);
    return NextResponse.json(
      { error: "Failed to process audio: " + error.message },
      { status: 500 }
    );
  } finally {
    // 6. Clean up
    if (tempInputPath && fs.existsSync(tempInputPath)) {
      fs.unlinkSync(tempInputPath);
    }
    if (tempOutputPath && fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }
  }
}
