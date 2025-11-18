import { getOldestMusic } from '../services/r2/listOldestMusic.js'
import { downloadMusic } from '../services/r2/downloadMusic.js'
import { deleteMusic } from '../services/r2/deleteMusic.js'

export async function processMusic() {
  const oldest = await getOldestMusic()

  if (!oldest) {
    console.log('🎵 No music found in R2 bucket.')
    return null
  }

  console.log('🎵 Downloading music:', oldest.Key)

  const localPath = await downloadMusic(oldest.Key)

  console.log('✅ Music downloaded to:', localPath)

  // Optional: delete after download
  // await deleteMusic(oldest.Key)
  // console.log("🗑️ Deleted music from R2:", oldest.Key)

  return { key: oldest.Key, localPath }
}

// Run standalone
if (process.argv[1] === new URL(import.meta.url).pathname) {
  processMusic().catch(console.error)
}
