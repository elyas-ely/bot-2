import { convertVideoToFullHD } from '../services/convertToFullHD.js'
import { loopVideoWithMusic } from '../services/createVideoLoop.js'
import { moveFileToSecondBucket } from '../services/r2/move.js'
import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { startTimer, stopTimer } from '../utils/jobTimer.js'
import { processNext } from '../workers/processNext.js'
import { Timer } from 'timer-node'

export async function getVideoJob() {
  ensureProjectDirectories()
  startTimer('Video Job')

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
    stopTimer('Video Job')
    // Optional cleanup
    // await emptyPublicFolder()
  }
}
