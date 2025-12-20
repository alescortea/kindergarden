import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const locationSchema = z.object({
  name: z.string().min(1, 'Location name is required'),
  countyId: z.string().min(1, 'County ID is required'),
  countyName: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const validatedData = locationSchema.parse(body)
    
    // Check if location already exists
    const { getCollection } = await import('~/composables/useFirestore')
    const { where } = await import('firebase/firestore')
    const existingLocations = await getCollection('locations', [
      where('name', '==', validatedData.name),
      where('countyId', '==', validatedData.countyId)
    ])
    
    if (existingLocations.length > 0) {
      return {
        id: existingLocations[0].id,
        message: 'Location already exists',
        existing: true
      }
    }
    
    const locationId = await createDocument('locations', validatedData)
    
    return {
      id: locationId,
      message: 'Location created successfully',
      existing: false
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
      statusMessage: 'Failed to create location'
    })
  }
})


