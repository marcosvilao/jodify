const fs = require('fs')
const path = require('path')
const csvToJson = require('csvtojson')
const { scrapPromoterData } = require('../utils/scrapping/scrapPromoterIgData.js')

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const scrapInstagram = async () => {
  let cwd = path.join(__dirname)
  const filePathSQLWrite = path.join(cwd, 'imports/new_division_Productoras.csv')
  let writeSQL = fs.createWriteStream(filePathSQLWrite)
  const filePath = path.join(
    cwd,
    'imports/Copia de Jodify - Prueba Marka - Division Productoras.csv'
  )
  const csv = fs.readFileSync(filePath, 'utf8')
  const json = await csvToJson().fromString(csv)

  try {
    const header =
      'Username,Fullname,Profile URL,22 may,Historial 15 May,Historial 7 May,Provincia,Localidad,Ubicación Jodify,Cantidad Eventos,Responsable,Historia,Fecha de publicación,Biografía\n'
    writeSQL.write(header)

    // Gather all profile URLs
    const urls = json.map((row) => row['Profile URL'])

    // Divide URLs into chunks
    const chunkSize = 50
    const urlsDivididas = []
    const jsonDividido = []
    const cleanData = (data) => {
      if (!data) return 'N/A'
      return data.replace(/[\n\r]/g, ' ').replace(/"/g, '""')
    }
    for (let i = 0; i < urls.length; i += chunkSize) {
      const chunk = urls.slice(i, i + chunkSize)
      urlsDivididas.push(chunk)
      const j = json.slice(i, i + chunkSize)
      jsonDividido.push(j)
    }

    for (let i = 0; i < urlsDivididas.length; i++) {
      const profilesData = await scrapPromoterData(urlsDivididas[i])

      for (const row of jsonDividido[i]) {
        const profileData = profilesData.find((profile) => profile.url === row['Profile URL'])
        const tieneHistoria = profileData?.story ? 'Sí' : 'No'
        const fechaPublicacion = profileData?.lastPostDate || 'N/A'
        const biografia = profileData?.bio || 'N/A'

        const newRow = [
          row.Username,
          row.Fullname,
          row['Profile URL'],
          row['22 may'],
          row['Historial 15 May'],
          row['Historial 7 May'],
          row.Provincia,
          row.Localidad,
          row['Ubicación Jodify'],
          row['Cantidad Eventos'],
          row.Responsable,
          tieneHistoria,
          cleanData(fechaPublicacion),
          cleanData(biografia),
        ].join(',')

        writeSQL.write(newRow + '\n')
      }

      // Esperar 3 minutos antes de procesar el siguiente chunk
      await delay(3 * 60 * 1000) // 3 minutos en milisegundos

      console.log(`vuelta ${i} de ${urlsDivididas.length}`)
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = { scrapInstagram }
