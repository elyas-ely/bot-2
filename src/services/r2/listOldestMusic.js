import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2 } from '../../config/r2.js'
import { R2_BUCKET, STORAGE_PATHS } from '../../constants/storage.js'

export async function getOldestMusic() {
  const prefix = STORAGE_PATHS.music.prefix || ''

  const res = await r2.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
    })
  )

  if (!res.Contents || res.Contents.length === 0) return null

  return res.Contents.sort(
    (a, b) => new Date(a.LastModified) - new Date(b.LastModified)
  )[0]
}
