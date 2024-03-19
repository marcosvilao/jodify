const { Client } = require('pg');
const {configDB} = require('../config')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');
const csvToJson =require('csvtojson');
const pool = require('../db');



const importDjs = async () => {
    const dbName = 'verceldb'
    let cwd = path.join(__dirname);
    const filePathSQLWrite = cwd + '/imports/insertDjs_Scripts.txt';
    let writeSQL = fs.createWriteStream(filePathSQLWrite);
    filePath = cwd + '/imports/Base Datos Djs - Hoja 3.csv';
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

      let types = await jodifyDB.query('SELECT * FROM public.types;')
      types = types.rows

      const typesMapped = new Map();

      for (let type of types) {
        typesMapped.set(type.name, type.id)
      }

        for (row of json) {
            if(row['Type of music 1']){
                const type1ID = typesMapped.get(row['Type of music 1'])
                const type2ID = typesMapped.get(row['Type of music 2'])


                const dj = {
                    id : uuidv4(),
                    name : row['Dj'],
                    instagram : row['Ig']
                }

               writeSQL.write(`INSERT INTO public.djs(
                id, name, instagram)
                VALUES ('${dj.id}', '${dj.name}', '${dj.instagram}');` + '\n') 

                writeSQL.write(`INSERT INTO public.dj_types(
                    dj_id, type_id)
                    VALUES ('${dj.id}', '${type1ID}');` + '\n')

                if(type2ID){
                    writeSQL.write(`INSERT INTO public.dj_types(
                        dj_id, type_id)
                        VALUES ('${dj.id}', '${type2ID}');` + '\n')
                }

            }
        }

        await jodifyDB.end();
        console.log('Finish')
    } catch (error) {
        console.log(error)
        await jodifyDB.end();
    }


}


importDjs()