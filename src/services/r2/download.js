import { GetObjectCommand } from '@aws-sdk/client-s3'
import fs from 'fs'
import path from 'path'
import { r2 } from '../../config/r2.js'
import { R2_BUCKET } from '../../constants/storage.js'

export async function downloadR2File(outputDir, fileName, key) {
  const outputPath = path.join(outputDir, fileName)

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
