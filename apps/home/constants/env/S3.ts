export const S3_CONFIG = {
  Bucket: process.env.S3_BUCKET || '',
  Region: process.env.S3_REGION || '',
  AccessKeyId: process.env.S3_ACCESS_KEY_ID || '',
  AccessKeySecret: process.env.S3_ACCESS_KEY_SECRET || '',
  Host: process.env.S3_HOST || '',
}
