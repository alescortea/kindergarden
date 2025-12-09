import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const campSchema = z.object({
  name: z.string(),
  location: z.enum(['straja', 'rafting', 'danube_delta', 'colibita']),
  year: z.number(),
  startDate: z.string(),
  endDate: z.string(),
  description: z.string(),
  price: z.number(),
  maxParticipants: z.number(),
  currentParticipants: z.number().default(0),
  gallery: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
  program: z.string().optional(),
  details: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = campSchema.parse(body)
    
    const campId = await createDocument('camps', validatedData)
    
    return {
      id: campId,
      message: 'Camp created successfully'
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
      statusMessage: 'Failed to create camp'
    })
  }
})



