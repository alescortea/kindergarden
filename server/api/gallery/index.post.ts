import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const galleryItemSchema = z.object({
  activityType: z.enum(['camp', 'hike', 'trip', 'ski', 'swimming', 'afterschool', 'general']),
  activityId: z.string().optional(),
  title: z.string().optional(),
  images: z.array(z.string()),
  videos: z.array(z.string()).default([]),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = galleryItemSchema.parse(body)
    
    const itemId = await createDocument('gallery', validatedData)
    
    return {
      id: itemId,
      message: 'Gallery item created successfully'
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
      statusMessage: 'Failed to create gallery item'
    })
  }
})



