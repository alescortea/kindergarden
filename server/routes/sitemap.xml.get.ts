export default defineEventHandler(async (event) => {
  const baseUrl = 'https://activitati-copii-roseli.ro'
  const currentDate = new Date().toISOString().split('T')[0]
  
  // Pagini statice principale
  const staticPages = [
    { url: '', changefreq: 'daily', priority: '1.0' },
    { url: '/activities', changefreq: 'weekly', priority: '0.9' },
    { url: '/afterschool', changefreq: 'weekly', priority: '0.9' },
    { url: '/camps', changefreq: 'weekly', priority: '0.9' },
    { url: '/hikes', changefreq: 'weekly', priority: '0.9' },
    { url: '/trips', changefreq: 'weekly', priority: '0.9' },
    { url: '/ski', changefreq: 'weekly', priority: '0.9' },
    { url: '/swimming', changefreq: 'weekly', priority: '0.9' },
    { url: '/school-offers', changefreq: 'weekly', priority: '0.8' },
    { url: '/gallery', changefreq: 'weekly', priority: '0.8' },
    { url: '/notice-board', changefreq: 'daily', priority: '0.8' },
    { url: '/registration', changefreq: 'monthly', priority: '0.7' },
  ]

  // Colectează pagini dinamice din Firestore prin API-uri
  const dynamicPages: Array<{ url: string; changefreq: string; priority: string; lastmod?: string }> = []

  try {
    // Tabere
    try {
      const camps = await $fetch('/api/camps') as any[]
      if (Array.isArray(camps)) {
        camps.forEach((camp: any) => {
          dynamicPages.push({
            url: `/camps?id=${camp.id}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: camp.updatedAt || camp.createdAt
          })
        })
      }
    } catch (e) {
      console.warn('[sitemap] Failed to fetch camps:', e)
    }

    // Drumeții
    try {
      const hikes = await $fetch('/api/hikes') as any[]
      if (Array.isArray(hikes)) {
        hikes.forEach((hike: any) => {
          dynamicPages.push({
            url: `/hikes?id=${hike.id}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: hike.updatedAt || hike.createdAt
          })
        })
      }
    } catch (e) {
      console.warn('[sitemap] Failed to fetch hikes:', e)
    }

    // Excursii
    try {
      const trips = await $fetch('/api/trips') as any[]
      if (Array.isArray(trips)) {
        trips.forEach((trip: any) => {
          dynamicPages.push({
            url: `/trips?id=${trip.id}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: trip.updatedAt || trip.createdAt
          })
        })
      }
    } catch (e) {
      console.warn('[sitemap] Failed to fetch trips:', e)
    }

    // Lecții de Ski
    try {
      const skiLessons = await $fetch('/api/ski') as any[]
      if (Array.isArray(skiLessons)) {
        skiLessons.forEach((lesson: any) => {
          dynamicPages.push({
            url: `/ski?id=${lesson.id}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: lesson.updatedAt || lesson.createdAt
          })
        })
      }
    } catch (e) {
      console.warn('[sitemap] Failed to fetch ski lessons:', e)
    }

    // Lecții de Înot
    try {
      const swimmingLessons = await $fetch('/api/swimming') as any[]
      if (Array.isArray(swimmingLessons)) {
        swimmingLessons.forEach((lesson: any) => {
          dynamicPages.push({
            url: `/swimming?id=${lesson.id}`,
            changefreq: 'weekly',
            priority: '0.8',
            lastmod: lesson.updatedAt || lesson.createdAt
          })
        })
      }
    } catch (e) {
      console.warn('[sitemap] Failed to fetch swimming lessons:', e)
    }
  } catch (error) {
    console.error('[sitemap] Error fetching dynamic pages:', error)
    // Continuă cu paginile statice dacă API-urile eșuează
  }

  // Generează XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${staticPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
${dynamicPages.map(page => `  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${page.lastmod ? new Date(page.lastmod).toISOString().split('T')[0] : currentDate}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}
</urlset>`

  event.node.res.setHeader('Content-Type', 'application/xml')
  return sitemap
})

