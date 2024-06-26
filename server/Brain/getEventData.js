const fs = require('fs')
const path = require('path')
const csvToJson = require('csvtojson')
const { scrapPromoterData } = require('../utils/scrapping/scrapPromoterIgData.js')

const scrapInstagram = async (username, password) => {
  let start = true
  let cwd = path.join(__dirname)
  const filePathSQLWrite = path.join(cwd, 'imports/new_division_Productoras.csv')
  const filePath = path.join(
    cwd,
    'imports/Copia de Jodify - Prueba Marka - Division Productoras.csv'
  )

  // Leer el CSV original
  const csv = fs.readFileSync(filePath, 'utf8')
  const json = await csvToJson().fromString(csv)

  // Leer el CSV de salida si existe y determinar la última línea procesada
  let lastProcessedIndex = 0
  let writeSQL

  if (fs.existsSync(filePathSQLWrite)) {
    const existingCsv = fs.readFileSync(filePathSQLWrite, 'utf8')
    const existingJson = await csvToJson().fromString(existingCsv)

    lastProcessedIndex = existingJson.length //- 1 // -1 porque tiene el header

    console.log('exist? en que linea quedo?:', lastProcessedIndex)

    writeSQL = fs.createWriteStream(filePathSQLWrite, { flags: 'a' })
  } else {
    writeSQL = fs.createWriteStream(filePathSQLWrite)
    const header =
      'Username,Fullname,Profile URL,22 may,Historial 15 May,Historial 7 May,Provincia,Localidad,Ubicación Jodify,Cantidad Eventos,Responsable,Historia,Fecha de publicación,Biografía\n'
    writeSQL.write(header)
  }

  // Gather all profile URLs
  const urls = json.map((row) => row['Profile URL'])

  // Dividir las URLs en chunks
  const chunkSize = 10
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

  // Continuar desde el último chunk procesado

  let page = null

  for (let i = Math.floor(lastProcessedIndex / chunkSize); i < urlsDivididas.length; i++) {
    try {
      // console.log('i:', i)
      let profilesData = null
      if (!page) {
        const response = await scrapPromoterData(
          urlsDivididas[i],
          start,
          i,
          urlsDivididas.length,
          username,
          password
        )
        profilesData = response?.data

        page = response?.page // me guardo la page asi no tengo que volver a iniciar sesión
      } else {
        const response = await scrapPromoterData(
          urlsDivididas[i],
          start,
          i,
          urlsDivididas.length,
          username,
          password,
          page
        )
        profilesData = response?.data
        page = response?.page // me guardo la page asi no tengo que volver a iniciar sesión
      }

      start = false

      // Determinar el índice de la fila dentro del chunk
      let startRowIndex = 0
      if (i === Math.floor(lastProcessedIndex / chunkSize)) {
        startRowIndex = lastProcessedIndex % chunkSize
      }

      for (let j = startRowIndex; j < (jsonDividido[i]?.length || 0); j++) {
        const row = jsonDividido[i][j]
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
    } catch (error) {
      start = false
      page = null
      console.log(`Error en la vuelta ${i + 1}:`, error)
      continue // Continuar con el siguiente chunk en caso de error
    }

    console.log(`vuelta ${i} de ${urlsDivididas.length}`)
  }

  writeSQL.end()
}

module.exports = { scrapInstagram }
