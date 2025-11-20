import fs from 'fs/promises'
import path from 'path'

export async function emptyPublicFolder() {
  const publicPath = 'public'

  try {
    // Check if folder exists
    await fs.access(publicPath)
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.log('ℹ️ public/ folder does not exist, nothing to clean')
      return
    } else {
      console.error('❌ Error checking public folder:', err)
      return
    }
  }

  try {
    const entries = await fs.readdir(publicPath, { withFileTypes: true })

    await Promise.all(
      entries.map(async (entry) => {
        const entryPath = path.join(publicPath, entry.name)
        if (entry.isDirectory()) {
          await fs.rm(entryPath, { recursive: true, force: true })
        } else {
          await fs.unlink(entryPath)
        }
      })
    )

    console.log('🧹 All contents inside public/ have been cleared')
  } catch (err) {
    console.error('❌ Failed to clear public folder:', err)
  }
}
