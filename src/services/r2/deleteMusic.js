import { DeleteObjectCommand } from '@aws-sdk/client-s3'
import { r2 } from '../../config/r2.js'
import { R2_BUCKET } from '../../constants/storage.js'

export async function deleteMusic(key) {
  return r2.send(
    new DeleteObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
    })
  )
}
