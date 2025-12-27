import { getAdmin } from '~/server/utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files provided'
      })
    }

    // Extract folder from formData if provided
    let folderName = 'general'
    const folderField = formData.find(f => f.name === 'folder' && !f.filename)
    if (folderField && folderField.data) {
      folderName = Buffer.from(folderField.data).toString('utf-8')
      console.log('Folder extracted from formData:', folderName)
    }
    
    // Find file in formData
    const file = formData.find(f => f.name === 'file' && f.filename && f.data)
    
    if (!file || !file.data || !file.filename) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing file'
      })
    }
    
    console.log('Processing file:', { filename: file.filename, type: file.type, folder: folderName })
    
    // Initialize Firebase Admin
    const admin = getAdmin()
    const bucket = admin.storage().bucket()
    
    // Generate file path
    const fileName = `${Date.now()}_${file.filename}`
    const filePath = `${folderName}/${fileName}`
    
    console.log('Uploading to path:', filePath)
    
    // Upload file using Admin SDK
    const fileRef = bucket.file(filePath)
    await fileRef.save(file.data, {
      contentType: file.type || 'application/octet-stream',
      resumable: false,
      metadata: {
        contentType: file.type || 'application/octet-stream',
      }
    })
    
    console.log('File uploaded successfully to:', filePath)
    
    // Make file publicly accessible and get URL
    await fileRef.makePublic()
    
    // Get public URL
    const url = `https://storage.googleapis.com/${bucket.name}/${filePath}`
    
    console.log('File URL:', url)
    
    return {
      uploads: [{
        filename: file.filename,
        url,
        type: file.type,
        size: file.data.length,
        path: filePath
      }],
      message: 'File uploaded successfully'
    }
  } catch (error: any) {
    console.error('Upload error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.message || 'Failed to upload files',
      data: error
    })
  }
})


