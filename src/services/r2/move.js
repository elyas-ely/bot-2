import { CopyObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '../../config/r2.js'
import { DEST_BUCKET, R2_BUCKET } from '../../constants/storage.js'

export async function moveFileToSecondBucket(file) {
  const { key, type } = file
  const destKey = `${type}/${key.split('/').pop()}`

  try {
    await r2.send(
      new CopyObjectCommand({
        Bucket: DEST_BUCKET,
        CopySource: `${R2_BUCKET}/${encodeURIComponent(key)}`,
        Key: destKey,
      })
    )

    await r2.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET,
        Key: key,
      })
    )
    console.log('file moved and deleted')
  } catch (err) {
    console.error(err)
    throw err
  }
}
