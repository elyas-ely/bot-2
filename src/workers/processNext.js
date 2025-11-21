import { STORAGE_PATHS } from '../constants/storage'
import { downloadR2File } from '../services/r2/download'
import { getOldestFile } from '../services/r2/listOldest'

export async function processNext(type) {
  const config = STORAGE_PATHS[type]

  if (!config) {
    console.error(`Invalid type: ${type}`)
    return null
  }

  const outputDir = config.downloads
  const prefix = config.prefix || ''

  try {
    console.log(`🔄 Processing ${type}...`)

    const oldest = await getOldestFile(prefix)

    if (!oldest) {
      throw new Error(`❌ No ${type} found in R2.`)
    }

    const fileName = type === 'videos' ? 'video.mp4' : 'music.mp3'

    const localPath = await downloadR2File(outputDir, fileName, oldest.Key)

    console.log(`✅ Downloaded ${type}:`, localPath)

    return {
      type,
      key: oldest.Key,
      localPath,
    }
  } catch (err) {
    throw err
  }
}
