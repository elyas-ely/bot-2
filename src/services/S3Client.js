import { S3Client } from '@aws-sdk/client-s3'
import 'dotenv/config'

export const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT, // like: https://<accountid>.r2.cloudflarestorage.com
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY,
    secretAccessKey: process.env.R2_SECRET_KEY,
  },
})
