import { deleteDocument } from '~/composables/useFirestore'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Notice board item ID is required'
      })
    }
    
    await deleteDocument('noticeBoard', id)
    
    return {
      message: 'Notice board item deleted successfully'
    }
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to delete notice board item'
    })
  }
})


