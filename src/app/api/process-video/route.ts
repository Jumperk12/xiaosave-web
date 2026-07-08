export const maxDuration = 60;
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

// Manually point fluent-ffmpeg to the physical location of the standalone binary
// Next.js sometimes messes up the path during compilation, so we use process.cwd() to find it directly
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

    // 1. Setup temporary file paths to store the video on the server
    const tempDir = os.tmpdir();
    const uniqueId = Date.now().toString();
    tempInputPath = path.join(tempDir, `input-${uniqueId}.mp4`);
    tempOutputPath = path.join(tempDir, `output-${uniqueId}.mp4`);

    // 2. Download the raw video from RedNote's masterUrl
    const response = await fetch(videoUrl);
    if (!response.ok) {
      throw new Error(`Failed to download raw video: ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(tempInputPath, buffer);

    // 3. Process video with FFmpeg to crop 8% off top and bottom
    // The filter 'crop=iw:ih*0.84:0:ih*0.08' means:
    // width = input width (iw)
    // height = input height * 0.84 (ih*0.84) - because 100% - 8% - 8% = 84%
    // x position = 0
    // y position = input height * 0.08 (starts 8% down from the top)
    await new Promise((resolve, reject) => {
      ffmpeg(tempInputPath)
        .videoFilters("crop=iw:ih*0.84:0:ih*0.08")
        .on("end", () => resolve(true))
        .on("error", (err) => reject(err))
        .save(tempOutputPath);
    });

    // 4. Read the freshly cropped video from the server's temp folder
    const processedVideoBuffer = fs.readFileSync(tempOutputPath);

    // 5. Send the video file directly back to the user's browser as a download
    return new NextResponse(processedVideoBuffer, {
      status: 200,
      headers: {
        "Content-Type": "video/mp4",
        "Content-Disposition": `attachment; filename="xiaosave-watermark-free-${uniqueId}.mp4"`,
      },
    });

  } catch (error: any) {
    console.error("Video processing error:", error);
    return NextResponse.json(
      { error: "Failed to process video: " + error.message },
      { status: 500 }
    );
  } finally {
    // 6. Clean up temporary files so our server's hard drive doesn't fill up
    if (tempInputPath && fs.existsSync(tempInputPath)) {
      fs.unlinkSync(tempInputPath);
    }
    if (tempOutputPath && fs.existsSync(tempOutputPath)) {
      fs.unlinkSync(tempOutputPath);
    }
  }
}
