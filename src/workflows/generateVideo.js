import { ensureProjectDirectories } from '../utils/ensureProjectDirectories.js'
import {
  emptyChunksFolder,
  emptyImagesFolder,
  emptyFinalFolder,
} from '../utils/cleanup.js'
import { loopVideoWithMusic } from '../services/createVideoLoop.js'

export async function generateVideoWorkflow() {
  ensureProjectDirectories()
  emptyChunksFolder()
  emptyImagesFolder()
  emptyFinalFolder()

  await loopVideoWithMusic()

  try {
  } catch (error) {
    console.error('Error generating video:', error)
  } finally {
    emptyChunksFolder()
    emptyImagesFolder()
    emptyFinalFolder()
  }
}
