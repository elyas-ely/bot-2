import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)
const FFMPEG = 'ffmpeg'

export async function serveVideo(inputVideo, outputVideo) {
  const inputPath = path.resolve(inputVideo)
  const outputPath = path.resolve(outputVideo)

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  // FFmpeg command: remove audio, scale to 16:9 (1920x1080), keep aspect ratio with padding
  const ffmpegCmd = `${FFMPEG} -y \
    -i "${inputPath}" \
    -c:v libx264 -preset veryfast -crf 23 \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
    -an \
    "${outputPath}"`

  try {
    console.log(`⏳ Removing audio and converting to 16:9: ${outputPath}`)
    await execAsync(ffmpegCmd)
    console.log(`✅ Video saved: ${outputPath}`)
    return outputPath
  } catch (err) {
    console.error('❌ FFmpeg failed:', err)
    throw err
  }
}
