const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const pool = require('../db');



const insertBuiltEvents = async () => {
    let cwd = path.join(__dirname);
    const filePathSQLWrite = cwd + '/assets/imports/eventCreate_Scripts.txt';
    let writeSQL = fs.createWriteStream(filePathSQLWrite);
    try {
      const config = configDB();
      const builtEvents = await buildEvents(); // Replace this with your logic to build events
      jodifyDB = new Client({
        ...config,
        database: dbName,
      });
  
  
      await jodifyDB.connect();
      console.log('Connection with the database established.');
  
      
  
  
      for (const eventData of builtEvents) {
        const query = `
          INSERT INTO event (
            id,
            name,
            event_type,
            date_from,
            venue,
            ticket_link,
            image_url,
            event_djs,
            city_id
          )
          VALUES (
            '${uuidv4()}',
            '${eventData.name}',
            '${eventData.event_Type}',
            '${eventData.event_Date}',
            '${eventData.event_Location}',
            '${eventData.ticket_Link}',
            '${eventData.event_Image}',
            ARRAY[${eventData.event_Djs.map(dj => `'${dj}'`).join(', ')}],
            '258fd495-92d3-4119-aa37-0d1c684a0237'
          );
        `;
  
        writeSQL.write(query + '\n');
      }
  
      await jodifyDB.end();
    } catch (error) {
      console.error('Error inserting data:', error);
      await jodifyDB.end();
    }
  };