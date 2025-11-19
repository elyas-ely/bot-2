import { STORAGE_PATHS } from '../constants/storage'
import { downloadR2File } from '../services/r2/download'
import { getOldestFile } from '../services/r2/listOldest'

export async function processNext(type) {
  const config = STORAGE_PATHS[type]

  if (!config) {
    throw new Error(`Invalid type: ${type}`)
  }

  const outputDir = config.downloads
  const prefix = config.prefix || ''

  try {
    console.log(`🔄 Processing ${type}...`)

    const oldest = await getOldestFile(prefix)
    if (!oldest) {
      console.log(`❌ No ${type} found in R2.`)
      return null
    }

    const localPath = await downloadR2File(outputDir, oldest.Key)

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
