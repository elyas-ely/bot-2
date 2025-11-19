import { moveFileToSecondBucket } from '../services/r2/move.js'
import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { processNext } from '../workers/processNext.js'

export async function getVideoJob() {
  try {
    ensureProjectDirectories()

    // const videoFile = await processNext('videos')
    // const musicFile = await processNext('musics')

    // await moveFileToSecondBucket(videoFile)
    // await moveFileToSecondBucket(musicFile)
  } catch (error) {
    console.log(error)
  } finally {
    // await emptyPublicFolder()
  }
}
