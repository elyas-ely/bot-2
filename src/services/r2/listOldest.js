// src/services/r2/listOldest.js
import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { r2 } from '../../config/r2.js'
import { R2_BUCKET } from '../../constants/storage.js'

export async function getOldestFile(prefix) {
  const res = await r2.send(
    new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix,
    })
  )

  if (!res.Contents || res.Contents.length === 0) return null

  // Filter out directories (keys ending with "/" or size 0)
  const files = res.Contents.filter(
    (item) => !item.Key.endsWith('/') && item.Size > 0
  )

  if (files.length === 0) return null

  return files.sort(
    (a, b) => new Date(a.LastModified) - new Date(b.LastModified)
  )[0]
}
