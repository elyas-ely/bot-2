import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)

const DEFAULT_INPUT = 'public/downloads/video/video.mp4'
const DEFAULT_OUTPUT = 'public/video/video.mp4'

export async function convertVideoToFullHD() {
  const inputPath = path.resolve(DEFAULT_INPUT)
  const outputPath = path.resolve(DEFAULT_OUTPUT)

  const ffmpegCmd = [
    'ffmpeg',
    '-y',
    `-i "${inputPath}"`,
    // Scale and pad to 1920x1080
    '-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2:black"',
    '-c:v libx264',
    '-preset veryfast',
    '-crf 22', // Slightly smaller file, still good quality
    '-r 30', // Reduce FPS to 30 for smaller file
    '-an', // Remove audio
    '-movflags +faststart', // Fast playback for web
    `"${outputPath}"`,
  ].join(' ')

  try {
    console.log('⏳ Converting video to Full HD')
    await execAsync(ffmpegCmd)
    console.log('✅ Full HD video ready')
    return outputPath
  } catch (error) {
    console.error('❌ Failed to convert video:', error)
    throw error
  }
}
