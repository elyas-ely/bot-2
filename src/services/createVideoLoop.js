import { exec } from 'child_process'
import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const execAsync = promisify(exec)
const FFMPEG = 'ffmpeg'
const FFPROBE = 'ffprobe'

const DEFAULT_DURATION_SECONDS = 300 // 5 minutes

function normalizeDurationSeconds(duration) {
  if (typeof duration === 'number' && Number.isFinite(duration)) {
    return Math.max(1, duration)
  }

  if (typeof duration === 'string') {
    // Support HH:MM:SS, MM:SS, or seconds-only strings
    const parts = duration.split(':').map(Number)
    if (parts.every((n) => Number.isFinite(n))) {
      if (parts.length === 3) {
        return parts[0] * 3600 + parts[1] * 60 + parts[2]
      }
      if (parts.length === 2) {
        return parts[0] * 60 + parts[1]
      }
      if (parts.length === 1) {
        return parts[0]
      }
    }
  }

  throw new Error('Invalid duration value provided.')
}

/**
 * Loops the source video (no audio) and music track to create a synced clip
 * of the requested length, avoiding re-encoding when possible.
 *
 * @param {number|string} duration - Desired clip length (seconds or HH:MM:SS).
 */
export async function loopVideoWithMusic(duration = DEFAULT_DURATION_SECONDS) {
  const videoPath = 'public/video/video.mp4'
  const musicPath = 'public/audio/music.mp3'
  const outputPath = 'public/final/output.mp4'

  const durationSeconds = normalizeDurationSeconds(duration)

  const outputDir = path.dirname(outputPath)
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
  }

  // const diagnostics = await collectDiagnostics({
  //   videoPath,
  //   musicPath,
  //   durationSeconds,
  // })

  const ffmpegCmd = `${FFMPEG} -y \
  -stream_loop -1 -i "${videoPath}" \
  -stream_loop -1 -i "${musicPath}" \
  -t ${durationSeconds} \
  -map 0:v:0 -map 1:a:0 \
  -c:v copy \
  -c:a aac -b:a 192k \
  -movflags +faststart \
  "${outputPath}"`

  console.log(`⏳ Creating ${durationSeconds}s video with looped music...`)

  try {
    const { stdout, stderr } = await execAsync(ffmpegCmd)

    // const outputDiagnostics = await collectDiagnostics({
    //   outputPath,
    // })
    // if (outputDiagnostics.output) {
    //   console.log(
    //     `✅ Done! Output duration ≈ ${outputDiagnostics.output.duration.toFixed(
    //       2
    //     )}s (${outputPath})`
    //   )
    // } else {
    //   console.log('✅ Done! File saved at:', outputPath)
    // }
    return outputPath
  } catch (error) {
    console.error('❌ FFmpeg failed:')
    console.error(error)
    throw error
  }
}

// async function collectDiagnostics({
//   videoPath,
//   musicPath,
//   outputPath,
//   durationSeconds,
// }) {
//   const results = {}
//   if (videoPath) {
//     results.video = await probeMedia(videoPath).catch(() => null)
//   }
//   if (musicPath) {
//     results.audio = await probeMedia(musicPath).catch(() => null)
//   }
//   if (outputPath) {
//     results.output = await probeMedia(outputPath).catch(() => null)
//   }
//   results.desiredDuration = durationSeconds
//   return results
// }

// async function probeMedia(filePath) {
//   if (!fs.existsSync(filePath)) {
//     throw new Error(`Missing file: ${filePath}`)
//   }

//   const cmd = `${FFPROBE} -v error -select_streams v:0 -show_entries stream=duration -of json "${filePath}"`
//   const audioCmd = `${FFPROBE} -v error -select_streams a:0 -show_entries stream=duration -of json "${filePath}"`

//   let duration = null
//   let type = 'unknown'

//   try {
//     const { stdout } = await execAsync(cmd)
//     const parsed = JSON.parse(stdout)
//     const streamDuration = parsed?.streams?.[0]?.duration
//     if (streamDuration) {
//       duration = Number(streamDuration)
//       type = 'video'
//     }
//   } catch {
//     // ignore, try audio probe
//   }

//   if (!duration) {
//     try {
//       const { stdout } = await execAsync(audioCmd)
//       const parsed = JSON.parse(stdout)
//       const streamDuration = parsed?.streams?.[0]?.duration
//       if (streamDuration) {
//         duration = Number(streamDuration)
//         type = 'audio'
//       }
//     } catch {
//       // ignore
//     }
//   }

//   return {
//     path: filePath,
//     duration,
//     type,
//   }
// }
