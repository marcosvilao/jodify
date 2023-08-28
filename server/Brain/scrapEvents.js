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
    const event_Title = eventParts[0] ? eventParts[0].trim() : '';
    const event_Date = eventParts[1] ? eventParts[1].trim() : '';
    const event_Location = eventParts[2] ? eventParts[2].trim() : '';
    const event_Type = event_Title.includes('(') && event_Title.includes(')') ?
    event_Title.substring(event_Title.indexOf('(') + 1, event_Title.indexOf(')')).trim() : '';
    const ticket_Link = event.hrefValue;
    const event_Image = event.imgValue;
    let event_Djs = event_Title.split(' + ')
      .map(dj => dj.trim())
      .map(dj => dj.replace(/\([^)]+\)/g, '')); // Remove parentheses and their contents

    // Remove event type from DJs list
    if (event_Type) {
      event_Djs = event_Djs.filter(dj => dj !== event_Type);
    }

    // Parse day, month, and year from the event_Date
    const [day, monthYear] = event_Date.split(' ');
    const [DD, month] = monthYear.split('/');

    // Construct the desired date format: 'YYYY/MM/DD'
    const formattedEvent_Date = `2023/${month}/${DD}`;

    const parts = event_Title.split(' + ');
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
      event_Title: cleanedTitle,
      event_Type,
      event_Date: formattedEvent_Date,
      event_Location,
      ticket_Link,
      event_Image,
      event_Djs
    };
  });
  return builtEvents;
};

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
          event_title,
          event_type,
          event_date,
          event_location,
          ticket_link,
          event_image,
          event_djs,
          city_id
        )
        VALUES (
          '${uuidv4()}',
          '${eventData.event_Title}',
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


insertBuiltEvents();




    
