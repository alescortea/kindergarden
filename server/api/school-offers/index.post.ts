import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const schoolOfferSchema = z.object({
  title: z.string(),
  description: z.string(),
  activities: z.array(z.string()),
  price: z.number().optional(),
  customPrice: z.boolean().default(false),
  transportIncluded: z.boolean().default(true),
  maxParticipants: z.number().optional(),
  gallery: z.array(z.string()).default([]),
  videos: z.array(z.string()).default([]),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = schoolOfferSchema.parse(body)
    
    const offerId = await createDocument('schoolOffers', validatedData)
    
    return {
      id: offerId,
      message: 'School offer created successfully'
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
      statusMessage: 'Failed to create school offer'
    })
  }
})



