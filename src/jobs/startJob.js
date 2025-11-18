import { emptyPublicFolder } from '../utils/cleanup.js'
import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import { processMusic } from '../workers/processMusic.js'
import { processNextVideo } from '../workers/processVideo.js'

export async function getVideoJob() {
  try {
    ensureProjectDirectories()

    // await processNextVideo()
    await processMusic()
  } catch (error) {
    console.log(error)
  } finally {
    // await emptyPublicFolder()
  }
}
