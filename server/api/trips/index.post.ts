import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const tripSchema = z.object({
  name: z.string(),
  destination: z.enum(['bucharest', 'targu_mures', 'sibiu']),
  date: z.string(),
  description: z.string(),
  price: z.number(),
  maxParticipants: z.number(),
  duration: z.string(),
  gallery: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  program: z.string().optional(),
  details: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = tripSchema.parse(body)
    
    const tripId = await createDocument('trips', validatedData)
    
    return {
      id: tripId,
      message: 'Trip created successfully'
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
      statusMessage: 'Failed to create trip'
    })
  }
})



