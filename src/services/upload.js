import fs from 'fs'
import readline from 'readline'
import { google } from 'googleapis'
import 'dotenv/config'

/* --------------------------
    CONFIG
--------------------------- */
const isProduction = process.env.NODE_ENV === 'production'
console.log('isProduction:', isProduction)

const SCOPES = ['https://www.googleapis.com/auth/youtube.upload']
const TOKEN_PATH = isProduction ? '/app/token.json' : 'token.json'
const VIDEO_FILE = 'public/final/output.mp4'
const CREDENTIALS_PATH = isProduction
  ? '/app/credentials.json'
  : 'credentials.json'

/* --------------------------
    CREATE AUTH CLIENT
--------------------------- */
function createOAuthClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH))
  const { client_id, client_secret, redirect_uris } = credentials.installed

  return new google.auth.OAuth2(client_id, client_secret, redirect_uris[0])
}

/* --------------------------
    GET NEW TOKEN (ONE-TIME)
--------------------------- */
async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  })

  console.log('\n🔑 Authorize this app by visiting this URL:\n')
  console.log(authUrl)
  console.log('\nPaste the code here:\n')

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  return new Promise((resolve) => {
    rl.question('Code: ', async (code) => {
      rl.close()
      try {
        const { tokens } = await oAuth2Client.getToken(code)
        oAuth2Client.setCredentials(tokens)

        fs.writeFileSync(TOKEN_PATH, JSON.stringify(tokens))
        console.log('✅ Token saved to:', TOKEN_PATH)

        resolve(oAuth2Client)
      } catch (err) {
        console.error('❌ Error retrieving access token', err)
        process.exit(1)
      }
    })
  })
}

/* --------------------------
    LOAD TOKENS OR START OAUTH
--------------------------- */
async function loadTokens(oAuth2Client) {
  if (!fs.existsSync(TOKEN_PATH)) {
    console.log('⚠️ token.json not found — starting manual Google login...')
    return await getNewToken(oAuth2Client)
  }

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH))
  oAuth2Client.setCredentials(token)

  // Auto-refresh and save tokens
  oAuth2Client.on('tokens', (newTokens) => {
    const updated = { ...token, ...newTokens }
    fs.writeFileSync(TOKEN_PATH, JSON.stringify(updated))
    console.log('🔄 Token refreshed and saved.')
  })

  return oAuth2Client
}

/* --------------------------
    UPLOAD VIDEO
--------------------------- */
export async function uploadVideo(videoFile = VIDEO_FILE) {
  const oAuth2Client = createOAuthClient()
  const auth = await loadTokens(oAuth2Client)

  const youtube = google.youtube({ version: 'v3', auth })

  try {
    console.log('🎬 Uploading video:', videoFile)

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
      media: {
        body: fs.createReadStream(videoFile),
      },
    })

    console.log('✅ Video uploaded successfully!')
    console.log(
      '📺 YouTube URL:',
      `https://www.youtube.com/watch?v=${res.data.id}`
    )
  } catch (err) {
    console.error('❌ Upload failed:', err)
  }
}
