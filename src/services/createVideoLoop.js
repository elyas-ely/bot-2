import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { exec } from 'child_process'

const execAsync = promisify(exec)
const FFMPEG = 'ffmpeg'
const DEFAULT_DURATION_SECONDS = 60 // 1 hour

function normalizeDurationSeconds(duration) {
  if (typeof duration === 'number' && Number.isFinite(duration))
    return Math.max(1, duration)
  if (typeof duration === 'string') {
    const parts = duration.split(':').map(Number)
    if (parts.every(Number.isFinite)) {
      if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
      if (parts.length === 2) return parts[0] * 60 + parts[1]
      if (parts.length === 1) return parts[0]
    }
  }
  throw new Error('Invalid duration value provided.')
}

export async function loopVideoWithMusic(duration = DEFAULT_DURATION_SECONDS) {
  const videoPath = path.resolve('public/video/video.mp4')
  const musicPath = path.resolve('public/downloads/music/music.mp3')
  const outputPath = path.resolve('public/final/output.mp4')

  const durationSeconds = normalizeDurationSeconds(duration)

  // Ensure output folder exists
  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true })

  // Get video duration
  const { stdout: videoDurationStdout } = await execAsync(
    `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${videoPath}"`
  )
  const videoDuration = parseFloat(videoDurationStdout)
  if (!videoDuration || isNaN(videoDuration))
    throw new Error('Could not get video duration.')

  const videoLoops = Math.ceil(durationSeconds / videoDuration)

  console.log(
    `⏳ Looping video (${videoDuration.toFixed(2)}s) and music to reach ${durationSeconds}s...`
  )

  // VPS-friendly FFmpeg command: copy video, encode audio only
  const ffmpegCmd = `${FFMPEG} -y \
    -stream_loop ${videoLoops - 1} -i "${videoPath}" \
    -stream_loop -1 -i "${musicPath}" \
    -t ${durationSeconds} \
    -map 0:v -map 1:a \
    -c:v copy -c:a aac -b:a 192k -movflags +faststart \
    "${outputPath}"`

  try {
    console.log('⏳ Creating final video...')
    await execAsync(ffmpegCmd)
    console.log(`✅ Video created: ${outputPath}`)
    return outputPath
  } catch (err) {
    console.error('❌ FFmpeg failed:', err)
    throw err
  }
}
