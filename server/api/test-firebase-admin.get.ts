import { getBucket } from '~/server/utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  try {
    const envInfo = {
      K_SERVICE: process.env.K_SERVICE || 'not set',
      GOOGLE_CLOUD_PROJECT: process.env.GOOGLE_CLOUD_PROJECT || 'not set',
      GOOGLE_APPLICATION_CREDENTIALS: process.env.GOOGLE_APPLICATION_CREDENTIALS || 'not set',
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET || 'not set',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'set (should not be on Cloud Run/VPS)' : 'not set',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'set (should not be on Cloud Run/VPS)' : 'not set',
      NODE_ENV: process.env.NODE_ENV || 'not set',
    }
    
    const environment = !!process.env.K_SERVICE 
      ? 'Cloud Run' 
      : (!!process.env.GOOGLE_APPLICATION_CREDENTIALS ? 'VPS (with JSON file)' : 'Local')

    let bucketInfo = null
    let error = null

    try {
      const bucket = getBucket()
      bucketInfo = {
        name: bucket.name,
        exists: 'checking...'
      }
      
      // Try to check if bucket exists (this will test permissions)
      const [exists] = await bucket.exists()
      bucketInfo.exists = exists
    } catch (err: any) {
      error = {
        message: err?.message,
        code: err?.code,
        name: err?.name,
        stack: err?.stack
      }
    }

    return {
      success: !error && bucketInfo?.exists,
      environment: envInfo,
      detectedEnvironment: environment,
      bucket: bucketInfo,
      error: error,
      isCloudRun: !!process.env.K_SERVICE,
      isVPS: !!process.env.GOOGLE_APPLICATION_CREDENTIALS && !process.env.K_SERVICE
    }
  } catch (err: any) {
    return {
      success: false,
      error: {
        message: err?.message,
        code: err?.code,
        name: err?.name,
        stack: err?.stack
      }
    }
  }
})

