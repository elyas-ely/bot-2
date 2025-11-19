import fs from 'fs'
import { google } from 'googleapis'
import 'dotenv/config'

const isProduction = process.env.NODE_ENV === 'production'
console.log('isProduction:', isProduction)

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
const TOKEN_PATH = isProduction ? '/app/token.json' : 'token.json'
const VIDEO_FILE = 'public/final/output.mp4'
const CREDENTIALS_PATH = isProduction
  ? '/app/credentials.json'
  : 'credentials.json'

function createOAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH))
  const { client_id, client_secret, redirect_uris } = credentials.installed
  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
}

function loadTokens(oAuth2Client) {
  if (!fs.existsSync(TOKEN_PATH))
    throw new Error('token.json not found! Please authorize manually once.')
  const token = JSON.parse(fs.readFileSync(TOKEN_PATH))
  oAuth2Client.setCredentials(token)

  // Automatically save new access tokens when refreshed
  oAuth2Client.on('tokens', (newTokens) => {
    const updated = { ...token, ...newTokens }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated))
  })

  return oAuth2Client
}

export async function uploadVideo(videoFile = VIDEO_FILE) {
  const oAuth2Client = createOAuthClient()

  try {
    const auth = loadTokens(oAuth2Client)
    const youtube = google.youtube({ version: 'v3', auth })

    console.log('Uploading video:', videoFile)

    const res = await youtube.videos.insert({
      part: 'snippet,status',
      requestBody: {
        snippet: {
          title: `My Relaxing Video ${isProduction ? 'VPS' : 'Local'}`,
          description: 'This video was uploaded automatically using Node.js 🤖',
          tags: ['relaxing', 'ai', 'nature'],
        },
        status: { privacyStatus: 'unlisted' },
      },
      media: { body: fs.createReadStream(videoFile) },
    })

    console.log('✅ Video uploaded successfully!')
    console.log(
      'YouTube URL:',
      `https://www.youtube.com/watch?v=${res.data.id}`
    )
  } catch (err) {
    console.error('Upload failed:', err)
  }
}
