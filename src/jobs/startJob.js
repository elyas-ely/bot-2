import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { processNextVideo } from '../workers/processVideo.js'

export async function getVideoJob() {
  try {
    ensureProjectDirectories()

    // await processNextVideo()
  } catch (error) {
    console.log(error)
  } finally {
    await emptyPublicFolder()
  }
}
