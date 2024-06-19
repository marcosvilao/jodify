const { Client } = require('pg');
const {configDB} = require('../config')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const csvToJson =require('csvtojson');


const scrapInstagram = async () => {

    let cwd = path.join(__dirname);
    const filePathSQLWrite = cwd + '/imports/division_Productoras.csv';
    let writeSQL = fs.createWriteStream(filePathSQLWrite);
    filePath = cwd + '/imports/division_Productoras.csv';
    const  csv = fs.readFileSync(filePath, 'utf8');
    const json = await csvToJson().fromString(csv);


    try {
            jodifyDB = new Client({
        ...config,
        database: dbName,
      });

      await jodifyDB.connect();
      console.log('Connection with the database established.');

      for (const row of json) {
        const profileData = await profileScrape(row['Profile URL']);
        const tieneHistoria = profileData.hasHistory ? 'Sí' : 'No';
        const fechaPublicacion = profileData.publicationDate || 'N/A';
        const biografia = profileData.biography || 'N/A';

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
            fechaPublicacion,
            biografia
        ].join(',');

        writeSQL.write(newRow + '\n');
    }

        await jodifyDB.end();
        console.log('Finish')
    } catch (error) {
        console.log(error)
        await jodifyDB.end();
    }
}


scrapInstagram()


