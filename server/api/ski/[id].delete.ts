import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Ski lesson ID is required'
      })
    }
    
    await deleteDocument('skiLessons', id)
    
    return {
      message: 'Ski lesson deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete ski lesson'
    })
  }
})



