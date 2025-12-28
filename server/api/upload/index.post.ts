import { defineEventHandler, readMultipartFormData, createError } from 'h3'
import { getAdmin } from '~/server/utils/firebaseAdmin'

export default defineEventHandler(async (event) => {
  try {
    const form = await readMultipartFormData(event)

    const folderPart = form?.find((p) => p.name === 'folder') as any
    const folder = (folderPart?.data?.toString?.() || 'uploads').replace(/[^a-zA-Z0-9/_-]/g, '')

    const filePart = form?.find((p) => p.name === 'file') as any

    // Debug util (păstrează măcar temporar cât testezi pe telefon)
    console.log('[upload] parts:', form?.map((p: any) => ({
      name: p.name,
      filename: p.filename,
      type: p.type,
      size: p.data?.length
    })))

    if (!filePart?.data) {
      throw createError({ statusCode: 400, statusMessage: "Missing file (field 'file')" })
    }

    const contentType = filePart.type || 'application/octet-stream'

    // Fallback filename (iOS poate trimite filename undefined sau "blob")
    const ext = contentType.startsWith('image/')
      ? contentType.split('/')[1].replace('jpeg', 'jpg')
      : 'bin'

    const incomingName = (filePart.filename || '').trim()
    const safeName = incomingName && incomingName !== 'blob'
      ? incomingName.replace(/[^a-zA-Z0-9._-]/g, '_')
      : `upload_${Date.now()}.${ext}`

    const admin = getAdmin()
    const bucket = admin.storage().bucket()

    const path = `${folder}/${Date.now()}_${safeName}`

    await bucket.file(path).save(filePart.data, {
      contentType,
      resumable: false,
    })

    // Make file publicly accessible
    await bucket.file(path).makePublic()

    // Returnează exact în formatul pe care îl aștepți în UI
    const url = `https://storage.googleapis.com/${bucket.name}/${path}`

    return { uploads: [{ path, url, contentType }] }
  } catch (err: any) {
    console.error('[upload] error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: err?.message || 'Upload failed',
      data: { code: err?.code, name: err?.name },
    })
  }
})


