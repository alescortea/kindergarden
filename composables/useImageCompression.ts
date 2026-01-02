/**
 * Composable pentru compresia imaginilor înainte de upload
 * Reduce dimensiunea fișierului pentru a evita eroarea 413 pe mobile
 */

interface CompressionOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  maxSizeMB?: number
}

/**
 * Comprimă o imagine folosind Canvas API
 * @param file - Fișierul original
 * @param options - Opțiuni de compresie
 * @returns Promise<File> - Fișierul comprimat
 */
export async function compressImage(
  file: File | Blob,
  options: CompressionOptions = {}
): Promise<File> {
  const {
    maxWidth = 1920,
    maxHeight = 1920,
    quality = 0.8,
    maxSizeMB = 2
  } = options

  return new Promise((resolve, reject) => {
    // Verifică dacă este imagine
    if (!(file instanceof File) && !(file instanceof Blob)) {
      reject(new Error('Fișierul trebuie să fie o imagine'))
      return
    }

    const fileType = file.type || 'image/jpeg'
    if (!fileType.startsWith('image/')) {
      // Dacă nu este imagine, returnează fișierul original
      if (file instanceof File) {
        resolve(file)
      } else {
        reject(new Error('Fișierul nu este o imagine'))
      }
      return
    }

    // Verifică dacă fișierul este deja suficient de mic
    const fileSizeMB = (file.size || 0) / (1024 * 1024)
    if (fileSizeMB <= maxSizeMB) {
      // Dacă este deja mic, returnează-l așa cum este
      if (file instanceof File) {
        resolve(file)
      } else {
        // Convert Blob to File
        const fileName = `image_${Date.now()}.jpg`
        resolve(new File([file], fileName, { type: fileType }))
      }
      return
    }

    const reader = new FileReader()
    
    reader.onload = (e: any) => {
      const img = new Image()
      
      img.onload = () => {
        try {
          // Calculează noile dimensiuni păstrând aspect ratio
          let { width, height } = img
          
          if (width > maxWidth || height > maxHeight) {
            const ratio = Math.min(maxWidth / width, maxHeight / height)
            width = width * ratio
            height = height * ratio
          }

          // Creează canvas și desenează imaginea redimensionată
          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height
          
          const ctx = canvas.getContext('2d')
          if (!ctx) {
            reject(new Error('Nu s-a putut crea contextul canvas'))
            return
          }

          // Setează calitatea de desenare
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          
          // Desenează imaginea redimensionată
          ctx.drawImage(img, 0, 0, width, height)

          // Convertește la blob cu compresie
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Nu s-a putut comprima imaginea'))
                return
              }

              // Verifică dacă dimensiunea este acceptabilă
              const compressedSizeMB = blob.size / (1024 * 1024)
              
              // Dacă încă este prea mare, încearcă cu calitate mai mică
              if (compressedSizeMB > maxSizeMB && quality > 0.5) {
                // Recursiv cu calitate mai mică
                compressImage(file, { ...options, quality: quality - 0.1 })
                  .then(resolve)
                  .catch(reject)
                return
              }

              // Creează File din Blob
              const fileName = file instanceof File 
                ? file.name.replace(/\.[^/.]+$/, '.jpg') 
                : `image_${Date.now()}.jpg`
              
              const compressedFile = new File([blob], fileName, {
                type: 'image/jpeg',
                lastModified: Date.now()
              })

              console.log(`[ImageCompression] Original: ${(file.size / 1024 / 1024).toFixed(2)}MB, Compressed: ${(compressedFile.size / 1024 / 1024).toFixed(2)}MB`)
              
              resolve(compressedFile)
            },
            'image/jpeg',
            quality
          )
        } catch (error: any) {
          console.error('[ImageCompression] Error:', error)
          // Dacă compresia eșuează, returnează fișierul original
          if (file instanceof File) {
            resolve(file)
          } else {
            reject(error)
          }
        }
      }

      img.onerror = () => {
        reject(new Error('Nu s-a putut încărca imaginea'))
      }

      img.src = e.target.result
    }

    reader.onerror = () => {
      reject(new Error('Nu s-a putut citi fișierul'))
    }

    reader.readAsDataURL(file)
  })
}

/**
 * Composable pentru a folosi compresia de imagini
 */
export const useImageCompression = () => {
  return {
    compressImage
  }
}

