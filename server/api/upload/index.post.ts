import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { getBucket } from '~/server/utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  try {
    console.log('[upload] Starting upload request...')
    
    const form = await readMultipartFormData(event)
    
    if (!form || form.length === 0) {
      console.error('[upload] No form data received')
      throw createError({ statusCode: 400, statusMessage: 'No form data provided' })
    }

    console.log('[upload] Form data received, parts count:', form.length)

    const folderPart = form?.find((p) => p.name === 'folder') as any
    const folder = (folderPart?.data?.toString?.() || 'uploads').replace(/[^a-zA-Z0-9/_-]/g, '')
    console.log('[upload] Folder:', folder)

    const filePart = form?.find((p) => p.name === 'file') as any

    // Debug util (păstrează măcar temporar cât testezi pe telefon)
    console.log('[upload] parts:', form?.map((p: any) => ({
      name: p.name,
      filename: p.filename,
      type: p.type,
      size: p.data?.length
    })))

    if (!filePart?.data) {
      console.error('[upload] Missing file part or data')
      throw createError({ statusCode: 400, statusMessage: "Missing file (field 'file')" })
    }

    const contentType = filePart.type || 'application/octet-stream'
    console.log('[upload] Content type:', contentType)
    console.log('[upload] File size:', filePart.data?.length, 'bytes')

    // Fallback filename (iOS poate trimite filename undefined sau "blob")
    const ext = contentType.startsWith('image/')
      ? contentType.split('/')[1].replace('jpeg', 'jpg')
      : 'bin'

    const incomingName = (filePart.filename || '').trim()
    const safeName = incomingName && incomingName !== 'blob'
      ? incomingName.replace(/[^a-zA-Z0-9._-]/g, '_')
      : `upload_${Date.now()}.${ext}`

    console.log('[upload] Safe filename:', safeName)

    // Get Firebase Storage bucket (folosește Service Account din Cloud Run)
    console.log('[upload] Getting Firebase Storage bucket...')
    let bucket
    try {
      bucket = getBucket()
      console.log('[upload] Storage bucket:', bucket.name)
    } catch (bucketError: any) {
      console.error('[upload] Bucket initialization error:', bucketError)
      throw createError({
        statusCode: 500,
        statusMessage: `Firebase Storage bucket initialization failed: ${bucketError?.message || 'Unknown error'}`,
        data: { originalError: bucketError?.message }
      })
    }

    const path = `${folder}/${Date.now()}_${safeName}`
    console.log('[upload] Upload path:', path)

    // Upload file
    console.log('[upload] Starting file upload to Firebase Storage...')
    try {
      await bucket.file(path).save(filePart.data, {
        contentType,
        resumable: false,
      })
      console.log('[upload] File saved successfully')
    } catch (saveError: any) {
      console.error('[upload] File save error:', saveError)
      throw createError({
        statusCode: 500,
        statusMessage: `Failed to save file: ${saveError?.message || 'Unknown error'}`,
        data: { code: saveError?.code, name: saveError?.name }
      })
    }

    // Make file publicly accessible
    console.log('[upload] Making file public...')
    try {
      await bucket.file(path).makePublic()
      console.log('[upload] File made public successfully')
    } catch (publicError: any) {
      console.error('[upload] Make public error:', publicError)
      // Nu aruncăm eroare aici, doar logăm - fișierul e deja salvat
    }

    // Returnează exact în formatul pe care îl aștepți în UI
    const url = `https://storage.googleapis.com/${bucket.name}/${path}`
    console.log('[upload] Upload successful, URL:', url)

    return { uploads: [{ path, url, contentType }] }
  } catch (err: any) {
    console.error('[upload] Error details:', {
      message: err?.message,
      code: err?.code,
      name: err?.name,
      stack: err?.stack,
      statusCode: err?.statusCode,
      statusMessage: err?.statusMessage
    })
    
    // Dacă eroarea e deja un createError, o aruncăm direct
    if (err?.statusCode) {
      throw err
    }
    
    throw createError({
      statusCode: err?.statusCode || 500,
      statusMessage: err?.message || 'Upload failed',
      data: { 
        code: err?.code, 
        name: err?.name,
        originalError: err?.message
      },
    })
  }
})


