import fs from 'fs'
import path from 'path'
import { r2 } from '../../config/r2.js'
import { R2_BUCKET, STORAGE_PATHS } from '../../constants/storage.js'
import { GetObjectCommand } from '@aws-sdk/client-s3'

export async function downloadMusic(downloadsDir, key) {
  if (!fs.existsSync(downloadsDir)) {
    fs.mkdirSync(downloadsDir, { recursive: true })
  }

  const outputPath = path.join(downloadsDir, path.basename(key))

  const res = await r2.send(
    new GetObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  )

  await new Promise((resolve, reject) => {
    res.Body.pipe(fs.createWriteStream(outputPath))
      .on('finish', resolve)
      .on('error', reject)
  })

  return outputPath
}
