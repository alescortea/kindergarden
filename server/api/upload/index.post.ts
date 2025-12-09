import { uploadImage, uploadVideo } from '~/composables/useStorage'

export default defineEventHandler(async (event) => {
  try {
    const formData = await readMultipartFormData(event)
    
    if (!formData || formData.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No files provided'
      })
    }

    const uploads = []
    
    for (const file of formData) {
      if (!file.filename || !file.data) continue
      
      const folder = file.name || 'general'
      // Convert Buffer to Uint8Array for File constructor
      const uint8Array = new Uint8Array(file.data)
      const fileObj = new File([uint8Array], file.filename, {
        type: file.type || 'application/octet-stream'
      })
      
      let url: string
      
      if (file.type?.startsWith('image/')) {
        url = await uploadImage(folder, fileObj)
      } else if (file.type?.startsWith('video/')) {
        url = await uploadVideo(folder, fileObj)
      } else {
        continue
      }
      
      uploads.push({
        filename: file.filename,
        url,
        type: file.type,
        size: file.data.length
      })
    }
    
    return {
      uploads,
      message: 'Files uploaded successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to upload files'
    })
  }
})


