import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { processNext } from '../workers/processNext.js'

export async function getVideoJob() {
  try {
    ensureProjectDirectories()

    // // await processNext('videos')
    // await processNext('musics')
  } catch (error) {
    console.log(error)
  } finally {
    // await emptyPublicFolder()
  }
}
