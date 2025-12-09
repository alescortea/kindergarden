import { getCollection } from '~/composables/useFirestore'
import { orderBy } from 'firebase/firestore'

export default defineEventHandler(async (event) => {
  try {
    // Try to get counties from Firestore cache
    const counties = await getCollection('counties', [orderBy('name', 'asc')])
    
    if (counties.length > 0) {
      return counties
    }

    // If no counties in Firestore, return static list
    // This can be populated later from an external API
    const staticCounties = [
      { id: 'AB', name: 'Alba', code: 'AB' },
      { id: 'AR', name: 'Arad', code: 'AR' },
      { id: 'AG', name: 'Argeș', code: 'AG' },
      { id: 'BC', name: 'Bacău', code: 'BC' },
      { id: 'BH', name: 'Bihor', code: 'BH' },
      { id: 'BN', name: 'Bistrița-Năsăud', code: 'BN' },
      { id: 'BT', name: 'Botoșani', code: 'BT' },
      { id: 'BR', name: 'Brăila', code: 'BR' },
      { id: 'BV', name: 'Brașov', code: 'BV' },
      { id: 'B', name: 'București', code: 'B' },
      { id: 'BZ', name: 'Buzău', code: 'BZ' },
      { id: 'CL', name: 'Călărași', code: 'CL' },
      { id: 'CS', name: 'Caraș-Severin', code: 'CS' },
      { id: 'CJ', name: 'Cluj', code: 'CJ' },
      { id: 'CT', name: 'Constanța', code: 'CT' },
      { id: 'CV', name: 'Covasna', code: 'CV' },
      { id: 'DB', name: 'Dâmbovița', code: 'DB' },
      { id: 'DJ', name: 'Dolj', code: 'DJ' },
      { id: 'GL', name: 'Galați', code: 'GL' },
      { id: 'GR', name: 'Giurgiu', code: 'GR' },
      { id: 'GJ', name: 'Gorj', code: 'GJ' },
      { id: 'HR', name: 'Harghita', code: 'HR' },
      { id: 'HD', name: 'Hunedoara', code: 'HD' },
      { id: 'IL', name: 'Ialomița', code: 'IL' },
      { id: 'IS', name: 'Iași', code: 'IS' },
      { id: 'IF', name: 'Ilfov', code: 'IF' },
      { id: 'MM', name: 'Maramureș', code: 'MM' },
      { id: 'MH', name: 'Mehedinți', code: 'MH' },
      { id: 'MS', name: 'Mureș', code: 'MS' },
      { id: 'NT', name: 'Neamț', code: 'NT' },
      { id: 'OT', name: 'Olt', code: 'OT' },
      { id: 'PH', name: 'Prahova', code: 'PH' },
      { id: 'SJ', name: 'Sălaj', code: 'SJ' },
      { id: 'SM', name: 'Satu Mare', code: 'SM' },
      { id: 'SB', name: 'Sibiu', code: 'SB' },
      { id: 'SV', name: 'Suceava', code: 'SV' },
      { id: 'TR', name: 'Teleorman', code: 'TR' },
      { id: 'TM', name: 'Timiș', code: 'TM' },
      { id: 'TL', name: 'Tulcea', code: 'TL' },
      { id: 'VL', name: 'Vâlcea', code: 'VL' },
      { id: 'VS', name: 'Vaslui', code: 'VS' },
      { id: 'VN', name: 'Vrancea', code: 'VN' },
    ]

    return staticCounties
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch counties'
    })
  }
})



