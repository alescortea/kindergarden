import { createDocument } from '~/composables/useFirestore'
import { z } from 'zod'

const childSchema = z.object({
  firstName: z.string().min(1, 'Prenumele este obligatoriu'),
  lastName: z.string().min(1, 'Numele este obligatoriu'),
  birthDate: z.string().nullable().optional(),
  age: z.number().nullable().optional(),
  gender: z.enum(['male', 'female']).optional(),
  cnp: z.string().optional(),
  otherInfo: z.string().optional(),
  skiLevel: z.string().optional(),
  skiEquipment: z.array(z.string()).optional(),
  swimmingLevel: z.string().optional(),
  medical: z.object({
    allergies: z.string().optional(),
    conditions: z.string().optional(),
    medications: z.string().optional(),
    notes: z.string().optional(),
  }).optional(),
})

const registrationSchema = z.object({
  activityType: z.enum(['camp', 'hike', 'trip', 'ski', 'swimming', 'afterschool', 'school-offer'], {
    errorMap: () => ({ message: 'Tipul de activitate este obligatoriu' })
  }),
  activityId: z.string().min(1, 'Activitatea este obligatorie'),
  numberOfChildren: z.number().int().min(1).max(5).optional(),
  children: z.array(childSchema).min(1, 'Trebuie să înregistrați cel puțin un copil'),
  parent: z.object({
    firstName: z.string().min(1, 'Prenumele părintelui este obligatoriu'),
    lastName: z.string().min(1, 'Numele părintelui este obligatoriu'),
    phone: z.string().min(1, 'Telefonul este obligatoriu'),
    email: z.string().email('Email invalid').min(1, 'Email-ul este obligatoriu'),
    relationship: z.string().min(1, 'Relația este obligatorie'),
  }),
  agreements: z.object({
    participation: z.boolean().refine((val) => val === true, {
      message: 'Trebuie să fiți de acord cu participarea copilului'
    }),
    medicalTreatment: z.boolean().refine((val) => val === true, {
      message: 'Trebuie să fiți de acord cu tratamentul medical'
    }),
    photos: z.boolean().refine((val) => val === true, {
      message: 'Trebuie să fiți de acord cu fotografia'
    }),
    transport: z.boolean().optional(),
    terms: z.boolean().refine((val) => val === true, {
      message: 'Trebuie să fiți de acord cu termenii și condițiile'
    }),
  }),
  afterschool: z.object({
    schedule: z.string().optional(),
    daysPerWeek: z.string().optional(),
    preferredDays: z.array(z.string()).optional(),
    startDate: z.string().nullable().optional(),
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
      // Format validation errors for better user experience
      const errorMessages = error.errors.map(err => {
        const path = err.path.join('.')
        return `${path}: ${err.message}`
      })
      
      throw createError({
        statusCode: 400,
        statusMessage: 'Eroare de validare',
        message: errorMessages.join('; '),
        data: {
          errors: error.errors,
          formattedErrors: errorMessages
        }
      })
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Eroare la crearea înscrierii',
      message: 'A apărut o eroare. Vă rugăm să încercați din nou.'
    })
  }
})



