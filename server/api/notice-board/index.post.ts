import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const noticeBoardSchema = z.object({
  title: z.string(),
  content: z.string().optional(),
  images: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  isActive: z.boolean().default(true),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = noticeBoardSchema.parse(body)
    
    const noticeId = await createDocument('noticeBoard', validatedData)
    
    return {
      id: noticeId,
      message: 'Notice board item created successfully'
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Validation error',
        data: error.errors
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create notice board item'
    })
  }
})



