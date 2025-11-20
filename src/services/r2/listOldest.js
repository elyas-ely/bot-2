// src/services/r2/listOldest.js
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2 } from '../../config/r2.js'
import { R2_BUCKET } from '../../constants/storage.js'

/**
 * Retry R2 calls if they take too long (timeout)
 * or fail with AbortError.
 */
async function withTimeoutRetry(fn, { timeoutMs = 5000, maxRetries = 3 } = {}) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), timeoutMs)

    try {
      const result = await fn(controller.signal)
      clearTimeout(timeout)
      return result
    } catch (err) {
      clearTimeout(timeout)

      const isLast = attempt === maxRetries
      const isTimeout = err.name === 'AbortError'

      // If it's not a timeout and it's the last attempt → throw
      if (!isTimeout && isLast) {
        throw err
      }

      // retry only on timeout
      if (!isTimeout) {
        throw err
      }

      // Wait before retrying (basic backoff)
      await new Promise((res) => setTimeout(res, 300 * attempt))

      if (isLast) throw err
    }
  }
}

/**
 * Fetch the oldest file under a prefix from R2
 */
export async function getOldestFile(prefix) {
  const res = await withTimeoutRetry(
    async (signal) => {
      return await r2.send(
        new ListObjectsV2Command({
          Bucket: R2_BUCKET,
          Prefix: prefix,
        }),
        { abortSignal: signal }
      )
    },
    {
      timeoutMs: 4000, // if no response in 4s → abort → retry
      maxRetries: 3, // try up to 3 times
    }
  )

  if (!res?.Contents?.length) return null

  const files = res.Contents.filter(
    (item) => !item.Key.endsWith('/') && item.Size > 0
  )

  if (!files.length) return null

  return files.sort(
    (a, b) => new Date(a.LastModified) - new Date(b.LastModified)
  )[0]
}
