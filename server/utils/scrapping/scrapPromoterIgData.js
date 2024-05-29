const puppeteer = require('puppeteer-extra')

const scrapPromoterData = async (urls) => {
  if (!Array.isArray(urls)) {
    return 'url debe ser un arreglo de urls'
  }

  const browser = await puppeteer.launch({ headless: true }) // Configurar en false para ver lo que hace el navegador
  const page = await browser.newPage()

  const username = 'maxtest145'
  const password = 'Flatron2000'

  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' })

  // Iniciar sesión
  await page.type('input[name="username"]', username, { delay: 100 })
  await page.type('input[name="password"]', password, { delay: 100 })
  await page.click('button[type="submit"]')

  // Esperar a que se redirija a la página principal
  await page.waitForNavigation({ waitUntil: 'networkidle2' })

  const data = []
  for (const url of urls) {
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
    console.log(`Biografía: ${bio}`)

    // Verificar si el usuario ha publicado una historia
    const story = await page.evaluate(() => {
      const storySection = document.querySelector('section.x6s0dn4')
      const hasStory = storySection ? storySection.querySelector('canvas') !== null : false
      return hasStory
    })

    console.log(`¿El usuario ha publicado una historia?: ${story}`)

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

    console.log(`Fecha de la última publicación: ${postDate}`)
    data.push({ url, bio, lastPostDate: postDate ?? null, story })
  }

  await browser.close()
  return data
}

module.exports = {
  scrapPromoterData,
}
