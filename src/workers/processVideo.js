// src/workers/processVideo.js
import { getOldestFile } from '../services/r2/listOldest.js'
import { downloadR2File } from '../services/r2/download.js'
import { deleteR2File } from '../services/r2/delete.js'

export async function processNextVideo() {
  const oldest = await getOldestFile()

  if (!oldest) {
    console.log('No videos to process.')
    return
  }

  const localPath = await downloadR2File(oldest.Key)
  // console.log('Downloaded:', localPath)

  // TODO: ffmpeg processing here

  // await deleteR2File(oldest.Key)
  // console.log('Deleted from R2:', oldest.Key)
}
