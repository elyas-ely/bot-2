import fs from 'fs'

export function ensureProjectDirectories() {
  const dirs = [
    'public/downloads/video',
    'public/downloads/music',
    'public/video',
    'public/final',
  ]

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
  })

  console.log('📁 All project directories are ready')
}
