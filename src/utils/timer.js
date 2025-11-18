// src/utils/timer.js
export async function runWithTimer(asyncFn) {
  const startTime = new Date()
  console.log(`⏱️ Job started at: ${startTime.toLocaleString()}`)

  try {
    const result = await asyncFn()

    const endTime = new Date()
    console.log(`✅ Workflow completed at: ${endTime.toLocaleString()}`)

    const durationMs = endTime - startTime
    const totalSeconds = Math.floor(durationMs / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    let timeString = ''
    if (hours > 0) timeString += `${hours}h `
    if (minutes > 0 || hours > 0) timeString += `${minutes}m `
    timeString += `${seconds}s`

    console.log(`⏳ Total time taken: ${timeString}`)

    return result
  } catch (err) {
    console.error('❌ Workflow failed:', err)
    throw err
  }
}
