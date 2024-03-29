const puppeteer = require('puppeteer');
const { Client } = require('pg');
const {configDB} = require('../config')
const fs = require('fs')
const path = require('path')
const { v4: uuidv4 } = require('uuid');


const dbName = 'verceldb'
const eventscrap = async () => {
  const browser = await puppeteer.launch();
try {

  
  
  const page = await browser.newPage();
  
  const response = await page.goto('https://linktr.ee/jodify');
  
  const statusCode = response.status();

  if (statusCode !== 200) {
  throw new Error(`Page could not be accessed. Status code: ${statusCode}`);
  }

  await page.waitForSelector('.sc-bdfBwQ.pkAuV');
  const result = await page.evaluate(() => {
    const events = document.querySelectorAll('.sc-bdfBwQ.pkAuV')
    const event = [...events].map(event => {
      const eventText = event.innerText.trim();
      const eventLink = event.lastChild.innerHTML
      let hrefValue;
      let imgValue;
      const imgRegex = /src="([^"]+)"/;
      const hrefRegex = /href="([^"]+)"/;
      const hrefmatch = eventLink.match(hrefRegex);
      const imgmatch = eventLink.match(imgRegex);

      if (hrefmatch && hrefmatch[1]) {
        hrefValue = hrefmatch[1];
      } else {
        console.log('Href attribute not found.');
      }

      if (imgmatch && imgmatch[1]) {
        imgValue = imgmatch[1];
      } else {
        console.log('Href attribute not found.');
      }

      return {
        eventText,
        hrefValue,
        imgValue
      }
    });
    return event
  })
  await browser.close()
  return result
} catch (error) {
  console.log(error)
  await browser.close()
}

}

const buildEvents = async () => {
    const scrapEvents = await eventscrap();
    const builtEvents = scrapEvents.map(event => {
    const eventParts = event.eventText.split(' - ');
    const name = eventParts[0] ? eventParts[0].trim() : '';
    const date_from = eventParts[1] ? eventParts[1].trim() : '';
    const venue = eventParts[2] ? eventParts[2].trim() : '';
    const event_Type = name.includes('(') && name.includes(')') ?
    name.substring(name.indexOf('(') + 1, name.indexOf(')')).trim() : '';
    const ticket_Link = event.hrefValue;
    const image_url = event.imgValue;
    let event_Djs = name.split(' + ')
      .map(dj => dj.trim())
      .map(dj => dj.replace(/\([^)]+\)/g, '')); // Remove parentheses and their contents

    // Remove event type from DJs list
    if (event_Type) {
      event_Djs = event_Djs.filter(dj => dj !== event_Type);
    }

    // Parse day, month, and year from the date_from
    const [day, monthYear] = date_from.split(' ');
    const [DD, month] = monthYear.split('/');

    // Construct the desired date format: 'YYYY/MM/DD'
    const formatteddate_from = `2023/${month}/${DD}`;

    const parts = name.split(' + ');
    let cleanedTitle = parts[0];
    
    if (parts.length > 1) {
        const lastIndexParentheses = parts[1].lastIndexOf('(');
        const lastIndexPlus = parts[1].lastIndexOf('+ otros');
    
        if (lastIndexParentheses !== -1) {
            if (lastIndexPlus !== -1 && lastIndexPlus > lastIndexParentheses) {
                cleanedTitle += ' + ' + parts[1].substring(0, lastIndexPlus).trim();
                cleanedTitle = cleanedTitle.includes('+ otros') ? cleanedTitle.replace('+ otros', '').trim() : cleanedTitle;
            } else {
                cleanedTitle += ' + ' + parts[1].substring(0, lastIndexParentheses).trim();
                cleanedTitle = cleanedTitle.includes('+ otros') ? cleanedTitle.replace('+ otros', '').trim() : cleanedTitle;
            }
        } else {
            cleanedTitle += ' + ' + parts[1];
            cleanedTitle = cleanedTitle.includes('+ otros') ? cleanedTitle.replace('+ otros', '').trim() : cleanedTitle;
        }

    }

    return {
      name: cleanedTitle,
      event_Type,
      date_from: formatteddate_from,
      venue,
      ticket_Link,
      image_url,
      event_Djs
    };
  });
  return builtEvents;
};

const insertBuiltEvents = async () => {
  let cwd = path.join(__dirname);
  const filePathSQLWrite = cwd + '/imports/eventCreate_Scripts.txt';
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
          '${eventData.date_from}',
          '${eventData.venue}',
          '${eventData.ticket_Link}',
          '${eventData.image_url}',
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







    
