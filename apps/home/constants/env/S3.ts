export const S3_CONFIG = {
  Bucket: process.env.NEXT_PUBLIC_S3_BUCKET || '',
  Region: process.env.NEXT_PUBLIC_S3_REGION || '',
  AccessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID || '',
  AccessKeySecret: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_SECRET || '',
  Host: process.env.NEXT_PUBLIC_S3_HOST || '',
}
