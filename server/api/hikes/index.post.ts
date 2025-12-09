import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const hikeSchema = z.object({
  name: z.string(),
  location: z.string().optional(),
  countyId: z.string().optional(),
  countyName: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  duration: z.string(),
  distance: z.string().optional(),
  elevation: z.string().optional(),
  description: z.string(),
  meetingPoint: z.string().optional(),
  price: z.number(),
  maxParticipants: z.number(),
  gallery: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  program: z.string().optional(),
  details: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = hikeSchema.parse(body)
    
    const hikeId = await createDocument('hikes', validatedData)
    
    return {
      id: hikeId,
      message: 'Hike created successfully'
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
      statusMessage: 'Failed to create hike'
    })
  }
})



