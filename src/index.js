import { serve } from 'bun'
import { Cron } from 'croner'
import 'dotenv/config'
import { getVideoJob } from './jobs/startJob.js'

const PORT = process.env.PORT || 7426

serve({
  port: PORT,
  hostname: '0.0.0.0',
  idleTimeout: 0,

  async fetch(req) {
    const url = new URL(req.url)

    // 🩺 Healthcheck route
    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({ status: 'ok', uptime: process.uptime() }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        }
      )
    }

    // No other routes
    return new Response('Not found', { status: 404 })
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

let counter = 0

const job = new Cron('* * * * *', () => {
  // <-- every hour at minute 0
  counter++
  console.log(`Running job #${counter}`)
  runJob()

  if (counter >= 5) {
    // you probably meant 5 runs
    console.log('✅ Completed 5 runs, stopping cron.')
    job.stop()
  }
})

runJob()
