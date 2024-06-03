const puppeteer = require('puppeteer-extra')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const scrapPromoterData = async (urls, start, vuelta, numeroVuelta, page) => {
  if (!Array.isArray(urls)) {
    return 'url debe ser un arreglo de urls'
  }

  console.log('start', start)

  if (start) {
    const browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    }) // Configurar en false para ver lo que hace el navegador
    page = await browser.newPage()

    const username = 'jorib86699'
    const password = 'Flatron2009'

    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' })

    // Iniciar sesión
    await page.type('input[name="username"]', username, { delay: 100 })
    await page.type('input[name="password"]', password, { delay: 100 })
    await page.click('button[type="submit"]')

    // Esperar a que se redirija a la página principal
    await page.waitForNavigation({ waitUntil: 'networkidle2' })
  }

  const data = []
  for (const url of urls) {
    if (!url || typeof url !== 'string' || !url.includes('instagram.com/')) {
      console.log(`URL no válida: ${url}`)
      continue // Saltar al siguiente loop
    }

    console.log('url scrap', url)

    await page.goto(url, { waitUntil: 'networkidle2' })

    // Esperar a que el selector esté presente
    await page
      .waitForSelector('section.xc3tme8', { timeout: 5000 })
      .catch(() => console.log('Selector no encontrado'))

    // Extraer la biografía del segundo <section> con la clase xc3tme8
    const bio = await page.evaluate(() => {
      const sections = document.querySelectorAll('section.xc3tme8')
      if (sections.length > 1) {
        const bioSection = sections[1]
        return bioSection ? bioSection.innerText : null
      }
      return null
    })

    // Verificar si el usuario ha publicado una historia
    const story = await page.evaluate(() => {
      const storySection = document.querySelector('section.x6s0dn4')
      const hasStory = storySection ? storySection.querySelector('canvas') !== null : false
      return hasStory
    })

    // Esperar a que el contenedor de la publicación esté presente
    await page
      .waitForSelector('div._aagw', { timeout: 5000 })
      .catch(() => console.log('No se encontraron publicaciones'))

    // Hacer clic en la última publicación
    await page.evaluate(() => {
      const posts = document.querySelectorAll('div._aagw')
      if (posts.length > 0) {
        posts[0].click()
      }
    })

    // Esperar a que el modal se abra
    await page
      .waitForSelector('div.x1yztbdb time', { timeout: 5000 })
      .catch(() => console.log('No se encontró la fecha de la publicación'))

    // Extraer la fecha de la publicación
    const postDate = await page.evaluate(() => {
      const timeElement = document.querySelector('div.x1yztbdb time')
      return timeElement ? timeElement.getAttribute('datetime') : null
    })

    data.push({ url, bio, lastPostDate: postDate ?? null, story })

    console.log('esperando 10 segundos..')
    await delay(10 * 1000) // 3 minutos en milisegundos
  }

  if (vuelta === numeroVuelta) {
    await browser.close()
  }

  return { page, data }
}

module.exports = {
  scrapPromoterData,
}
