import { updateDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const galleryItemSchema = z.object({
  activityType: z.enum(['camp', 'hike', 'trip', 'ski', 'swimming', 'afterschool', 'general']).optional(),
  activityId: z.string().optional(),
  title: z.string().optional(),
  images: z.array(z.string()).optional(),
  videos: z.array(z.string()).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Gallery item ID is required'
      })
    }
    
    const validatedData = galleryItemSchema.parse(body)
    await updateDocument('gallery', id, validatedData)
    
    return {
      message: 'Gallery item updated successfully'
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
      statusMessage: 'Failed to update gallery item'
    })
  }
})


