const axios = require('axios')
const { LRUCache } = require('lru-cache')

const cache = new LRUCache({ max: 100 })

async function getImageFromCache(imageUrl) {
  const cachedImage = cache.get(imageUrl)

  if (cachedImage) {
    // console.log('imagen de chace')
    return cachedImage
  } else {
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' })

      cache.set(imageUrl, Buffer.from(response.data))

      //   console.log('imagen guardada en el cache')

      return Buffer.from(response.data)
    } catch (error) {
      return 'Error al obtener la imagen desde Cloudinary: ' + error.message
    }
  }
}

module.exports = {
  getImageFromCache,
}
