import { getCollection } from '~/composables/useFirestore'
import { orderBy, where } from 'firebase/firestore'
import { getQuery } from 'h3'

export default defineEventHandler(async (event) => {
  try {
    const queryParams = getQuery(event)
    const countyId = queryParams.countyId as string

    if (!countyId || countyId === '') {
      return []
    }

    // First, try to get from Firestore (user-added locations)
    try {
      const whereConstraints: any[] = [where('countyId', '==', countyId)]
      
      try {
        const constraintsWithOrder = [...whereConstraints, orderBy('name', 'asc')]
        const firestoreLocations = await getCollection('locations', constraintsWithOrder)
        console.log(`Loaded ${firestoreLocations.length} locations from Firestore for county ${countyId}`)
        
        // If we have locations in Firestore, return them
        if (firestoreLocations.length > 0) {
          return firestoreLocations
        }
      } catch (orderByError: any) {
        // If orderBy fails, try without it
        const errorMsg = orderByError?.message || String(orderByError)
        const errorCode = orderByError?.code || ''
        
        const isIndexError = 
          errorMsg.includes('index') || 
          errorMsg.includes('requires an index') || 
          errorMsg.includes('The query requires an index') ||
          errorCode === 'failed-precondition'
        
        if (isIndexError) {
          const firestoreLocations = await getCollection('locations', whereConstraints)
          const sorted = firestoreLocations.sort((a: any, b: any) => {
            const nameA = (a.name || '').toLowerCase()
            const nameB = (b.name || '').toLowerCase()
            return nameA.localeCompare(nameB)
          })
          
          if (sorted.length > 0) {
            return sorted
          }
        }
      }
    } catch (firestoreError) {
      console.warn('Firestore query failed, trying INAP API:', firestoreError)
    }

    // If no locations in Firestore, fetch from INAP API
    try {
      const response = await $fetch('https://api.inap.ro/nomenclator/localitati', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          judet: countyId
        }
      })

      // Transform INAP response to our format
      let locations: any[] = []
      
      if (response && response.data && Array.isArray(response.data)) {
        locations = response.data.map((loc: any) => ({
          id: loc.cod || loc.code || loc.id,
          name: loc.denumire || loc.name || loc.nume,
          countyId: loc.judet || loc.countyId || countyId,
          countyName: loc.judetNume || loc.countyName || ''
        })).sort((a: any, b: any) => a.name.localeCompare(b.name))
      } else if (response && Array.isArray(response)) {
        locations = response.map((loc: any) => ({
          id: loc.cod || loc.code || loc.id,
          name: loc.denumire || loc.name || loc.nume,
          countyId: loc.judet || loc.countyId || countyId,
          countyName: loc.judetNume || loc.countyName || ''
        })).sort((a: any, b: any) => a.name.localeCompare(b.name))
      }

      console.log(`Loaded ${locations.length} locations from INAP API for county ${countyId}`)
      return locations
    } catch (inapError: any) {
      console.warn('Failed to fetch from INAP API:', inapError.message)
      // Return empty array if both Firestore and INAP fail
      return []
    }
  } catch (error: any) {
    console.error('Locations API Error:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined
    const errorCode = error?.code || ''
    
    // Return empty array instead of error for better UX
    console.warn('Returning empty array due to error')
    return []
  }
})

