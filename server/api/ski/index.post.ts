import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const skiLessonSchema = z.object({
  type: z.enum(['individual', 'group']),
  duration: z.string(),
  price: z.number(),
  description: z.string(),
  maxParticipants: z.number().optional(),
  availableDates: z.array(z.string()).default([]),
  gallery: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = skiLessonSchema.parse(body)
    
    const lessonId = await createDocument('skiLessons', validatedData)
    
    return {
      id: lessonId,
      message: 'Ski lesson created successfully'
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
      statusMessage: 'Failed to create ski lesson'
    })
  }
})



