import { serve } from 'bun'
import 'dotenv/config'
import { getVideoJob } from './jobs/startJob.js'

const PORT = process.env.PORT || 7426

serve({
  port: PORT,
  hostname: '0.0.0.0',
  idleTimeout: 0,
  async fetch(req) {
    if (new URL(req.url).pathname === '/') {
      return new Response('✅ Video workflow already ran on server start!')
    }
    return new Response('🚀 Bot is running. Visit /generate to start.', {
      headers: { 'Content-Type': 'text/plain' },
    })
  },
})
console.log(`🌐 Server running on http://localhost:${PORT}`)

async function runJob() {
  try {
    await getVideoJob()
  } catch (err) {
    console.error('❌ Workflow failed:', err)
  }
}

runJob()
