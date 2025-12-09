import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Registration ID is required'
      })
    }
    
    await deleteDocument('registrations', id)
    
    return {
      message: 'Registration deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete registration'
    })
  }
})



