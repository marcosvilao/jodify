const { Client } = require('pg');
const {configDB} = require('../config')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const csvToJson =require('csvtojson');
const pool = require('../db');




const importPromoters = async () => {
    const dbName = 'verceldb'
    let cwd = path.join(__dirname);
    const filePathSQLWrite = cwd + '/imports/eventCreate_Scripts.txt';
    let writeSQL = fs.createWriteStream(filePathSQLWrite);
    filePath = cwd + '/imports/promoters.csv';
    const  csv = fs.readFileSync(filePath, 'utf8');
    const json = await csvToJson().fromString(csv);

    const config = configDB();

    try {
            jodifyDB = new Client({
        ...config,
        database: dbName,
      });

      await jodifyDB.connect();
      console.log('Connection with the database established.');

        for (row of json) {
            writeSQL.write(`
            INSERT INTO promoters (
                "name",
                "social_link"
            ) VALUES (
                '${row['name']}',
                '${row['social_link']}'
            );` + '\n')
        }

        await jodifyDB.end();
        console.log('Finish')
    } catch (error) {
        console.log(error)
        await jodifyDB.end();
    }


}

const getDjs = async () => {

    try {
        const allEventDjs = await pool.query('SELECT DISTINCT event_Djs FROM event');

        const flatDjs = allEventDjs.rows.flatMap(event => event.event_djs);
        const uniqueDJs = [...new Set(flatDjs)];

        for (const djName of uniqueDJs) {

            await pool.query('INSERT INTO djs (id, name) VALUES ($1, $2)', [uuidv4(),djName]);
        }

        
    } catch (error) {
        console.log(error)
    }

}

getDjs()