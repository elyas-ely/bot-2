import { error } from 'firebase-functions/logger'
import { convertVideoToFullHD } from '../services/convertToFullHD.js'
import { loopVideoWithMusic } from '../services/createVideoLoop.js'
import { moveFileToSecondBucket } from '../services/r2/move.js'
import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { startTimer, stopTimer } from '../utils/jobTimer.js'
import { processNext } from '../workers/processNext.js'
import { uploadVideo } from '../services/upload.js'

export async function getVideoJob() {
  ensureProjectDirectories()
  startTimer('Video Job')

  try {
    const videoFile = await processNext('videos')

    if (!videoFile) {
      return
    }
    const musicFile = await processNext('musics')

    if (!musicFile) {
      throw error
    }
    await convertVideoToFullHD()
    await loopVideoWithMusic()
    await uploadVideo()
    // await moveFileToSecondBucket(videoFile)
    // await moveFileToSecondBucket(musicFile)
  } catch (error) {
    console.log('❌ Video job failed:', error.message)
  } finally {
    stopTimer('Video Job')
    await emptyPublicFolder()
  }
}
