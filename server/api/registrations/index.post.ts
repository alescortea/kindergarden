import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const registrationSchema = z.object({
  activityType: z.enum(['camp', 'hike', 'trip', 'ski', 'swimming', 'afterschool', 'school-offer']),
  activityId: z.string(),
  child: z.object({
    firstName: z.string(),
    lastName: z.string(),
    birthDate: z.string(),
    age: z.number(),
    gender: z.enum(['male', 'female']),
    cnp: z.string().optional(),
  }),
  parent: z.object({
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string(),
    email: z.string().email(),
    relationship: z.string(),
  }),
  medical: z.object({
    allergies: z.string().optional(),
    conditions: z.string().optional(),
    medications: z.string().optional(),
    notes: z.string().optional(),
  }),
  agreements: z.object({
    medicalTreatment: z.boolean(),
    photos: z.boolean(),
    transport: z.boolean(),
    terms: z.boolean(),
  }),
  afterschool: z.object({
    schedule: z.string().optional(),
    daysPerWeek: z.string().optional(),
    preferredDays: z.array(z.string()).optional(),
    startDate: z.string().optional(),
  }).optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    
    // Validate request body
    const validatedData = registrationSchema.parse(body)
    
    // Create registration
    const registrationId = await createDocument('registrations', {
      ...validatedData,
      status: 'pending',
    })
    
    return {
      id: registrationId,
      message: 'Registration created successfully'
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
      statusMessage: 'Failed to create registration'
    })
  }
})



