// src/utils/jobTimer.js
import { Timer } from 'timer-node'

let currentTimer = null
let startTime = null

export function startTimer(label = 'Job') {
  startTime = new Date()
  console.log(`⏱️ ${label} started at: ${startTime.toLocaleString()}`)

  currentTimer = new Timer({ label })
  currentTimer.start()
}

export function stopTimer(label = 'Job') {
  if (!currentTimer || !startTime) {
    console.warn('⚠️ Timer was not started!')
    return
  }

  currentTimer.stop()
  const elapsed = currentTimer.time()

  const endTime = new Date()
  console.log(`✅ ${label} finished at: ${endTime.toLocaleString()}`)
  console.log(
    `⏳ Total time taken: ${elapsed.h.toFixed(2)} h / ${elapsed.m.toFixed(2)} m / ${elapsed.s.toFixed(2)} s`
  )

  // Reset
  currentTimer = null
  startTime = null
}
