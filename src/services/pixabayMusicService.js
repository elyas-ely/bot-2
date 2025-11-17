import fs from 'fs'
import path from 'path'
import axios from 'axios'

const PIXABAY_KEY = process.env.PIXABAY_ACCESS_KEY
const MUSIC_DIR = path.join('public/music')

if (!fs.existsSync(MUSIC_DIR)) fs.mkdirSync(MUSIC_DIR, { recursive: true })

const DEFAULT_QUERY = 'calm piano'
const FETCH_COUNT = 10 // fetch 10 tracks and pick randomly

/**
 * Search Pixabay music
 */
async function searchMusic() {
  const url = `https://pixabay.com/api/audio/?key=${PIXABAY_KEY}&q=${encodeURIComponent(DEFAULT_QUERY)}&per_page=${FETCH_COUNT}`
  try {
    const res = await axios.get(url)
    const hits = res.data.hits || []
    if (hits.length === 0) return null

    // Pick a random track
    const randomIndex = Math.floor(Math.random() * hits.length)
    return hits[randomIndex]
  } catch (err) {
    console.log('❌ Pixabay search error:', err.message)
    return null
  }
}

/**
 * Download a single track
 */
async function downloadTrack(trackUrl, name = 'music') {
  const fileName = `${name.replace(/[^a-z0-9]/gi, '_')}.mp3`
  const filePath = path.join(MUSIC_DIR, fileName)

  try {
    const res = await axios.get(trackUrl, { responseType: 'stream' })
    await new Promise((resolve, reject) => {
      res.data
        .pipe(fs.createWriteStream(filePath))
        .on('finish', resolve)
        .on('error', reject)
    })
    console.log(`✅ Downloaded: ${fileName}`)
    return filePath
  } catch (err) {
    console.log('❌ Download error:', err.message)
    return null
  }
}

/**
 * Fetch & download one random calm piano track
 */
export async function fetchAndDownloadMusic() {
  const track = await searchMusic()
  if (!track) {
    console.log('❌ No track found')
    return null
  }

  const filePath = await downloadTrack(
    track.previewURL,
    track.tags.split(',')[0]
  )

  return {
    title: track.tags,
    duration: track.duration,
    file: filePath,
    downloads: track.downloads,
    pageURL: track.pageURL,
  }
}
