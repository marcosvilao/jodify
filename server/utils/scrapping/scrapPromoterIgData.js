const puppeteer = require('puppeteer-extra')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const scrapPromoterData = async (urls, start, vuelta, numeroVuelta, username, password, page) => {
  if (!Array.isArray(urls)) {
    return 'url debe ser un arreglo de urls'
  }

  let browser
  if (start) {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    }) // Configurar en false para ver lo que hace el navegador
    page = await browser.newPage()

    await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle2' })

    // Iniciar sesión

    await page
      .waitForSelector('input[name="username"]', { timeout: 5000 })
      .catch(() => console.log('input[name="username"] no encontrado'))

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

    const getLastPostDate = async () => {
      const pinnedDates = []
      let latestNonPinnedDate = null

      // Esperar a que el div contenedor de las publicaciones esté presente
      await page
        .waitForSelector('div.x1lliihq.x1n2onr6.xh8yej3.x4gyw5p.xfllauq.xo2y696.x11i5rnm.x2pgyrj', {
          timeout: 10000,
        })
        .catch(() => console.log('Selector no encontrado, perfil privado?'))

      // Obtener todos los posts
      const posts = await page.$$(
        'div.x1lliihq.x1n2onr6.xh8yej3.x4gyw5p.xfllauq.xo2y696.x11i5rnm.x2pgyrj'
      )

      // Iterar sobre cada post
      for (let i = 0; i < posts.length; i++) {
        await posts[i].click()
        await delay(3 * 1000)

        // Verificar si el post está fijado
        const isPinned = await page.evaluate((post) => {
          const svgElement = post.querySelector('svg[aria-label="Icono de publicación fijada"]')
          if (!svgElement) return false // Si no encuentra el SVG, no está fijado

          const titleElement = svgElement.querySelector('title')
          return titleElement && titleElement.textContent.trim() === 'Icono de publicación fijada'
        }, posts[i])

        // Si el post no está fijado, capturar su fecha
        if (!isPinned) {
          // Esperar a que el modal se abra
          await page
            .waitForSelector('div.x1yztbdb time', { timeout: 5000 })
            .catch(() => console.log('No se encontró la fecha de la publicación'))

          const postDate = await page.evaluate(() => {
            const timeElement = document.querySelector('div.x1yztbdb time')
            return timeElement ? timeElement.getAttribute('datetime') : null
          })

          // Almacenar la fecha del post no fijado
          latestNonPinnedDate = postDate

          // Cerrar el modal
          await page.click('svg[aria-label="Cerrar"]')
          break
        }

        // Si el post está fijado, capturar su fecha y agregarla al array de fechas fijadas
        const postDate = await page.evaluate(() => {
          const timeElement = document.querySelector('div.x1yztbdb time')
          return timeElement ? timeElement.getAttribute('datetime') : null
        })

        pinnedDates.push(postDate)

        // Cerrar el modal
        await page.click('svg[aria-label="Cerrar"]')
      }

      // Comparar las fechas y retornar la más reciente
      if (latestNonPinnedDate) {
        const latestPinnedDate = Math.max(...pinnedDates.map((date) => new Date(date).getTime()))
        const latestNonPinnedTimestamp = new Date(latestNonPinnedDate).getTime()
        return new Date(Math.max(latestPinnedDate, latestNonPinnedTimestamp)).toISOString()
      } else {
        return pinnedDates.length > 0
          ? new Date(Math.max(...pinnedDates.map((date) => new Date(date).getTime()))).toISOString()
          : null
      }
    }
    const postDate = await getLastPostDate()

    data.push({ url, bio, lastPostDate: postDate ?? null, story })

    console.log('esperando 10 segundos..')
    await delay(10 * 1000) // 10 segundos en milisegundos
  }

  if (vuelta === numeroVuelta) {
    await browser.close()
  }

  return { page, data }
}

module.exports = {
  scrapPromoterData,
}
