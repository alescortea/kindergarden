import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Gallery item ID is required'
      })
    }
    
    await deleteDocument('gallery', id)
    
    return {
      message: 'Gallery item deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete gallery item'
    })
  }
})


