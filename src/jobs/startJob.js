import { convertVideoToFullHD } from '../services/convertToFullHD.js'
import { loopVideoWithMusic } from '../services/createVideoLoop.js'
import { moveFileToSecondBucket } from '../services/r2/move.js'
import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { processNext } from '../workers/processNext.js'
import { Timer } from 'timer-node'

export async function getVideoJob() {
  ensureProjectDirectories()

  const startTime = new Date()
  console.log(`⏱️ Video job started at: ${startTime.toLocaleString()}`)

  const timer = new Timer({ label: 'Video Job' })
  timer.start()

  try {
    await loopVideoWithMusic()

    // await convertVideoToFullHD()
    // const videoFile = await processNext('videos')
    // const musicFile = await processNext('musics')
    // await moveFileToSecondBucket(videoFile)
    // await moveFileToSecondBucket(musicFile)

    console.log('✅ Video job completed successfully')
  } catch (error) {
    console.error('❌ Video job failed:', error)
  } finally {
    timer.stop()
    const elapsed = timer.time()
    console.log(
      `⏳ Total time taken: ${elapsed.h.toFixed(2)} h / ${elapsed.m.toFixed(2)} m / ${elapsed.s.toFixed(2)} s`
    )

    // Optional cleanup
    // await emptyPublicFolder()
  }
}
