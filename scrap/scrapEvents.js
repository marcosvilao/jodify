const puppeteer = require('puppeteer');
const pool = require('../server/db')

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
    console.log('hi 2')
    const events = document.querySelectorAll('.sc-bdfBwQ.pkAuV')
    const event = [...events].map(event => {
      const eventText = event.innerText.trim();
      const eventLink = event.lastChild.innerHTML
      let hrefValue;
      const hrefRegex = /href="([^"]+)"/;
      const match = eventLink.match(hrefRegex);

      if (match && match[1]) {
        hrefValue = match[1];
        console.log(hrefValue);
      } else {
        console.log('Href attribute not found.');
      }

      return {
        eventText,
        hrefValue
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
    const event_Image = '';

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

    return {
      event_Title,
      event_Type,
      event_Date: formattedEvent_Date,
      event_Location,
      ticket_Link,
      event_Image,
      event_Djs
    };
  });
  console.log(buildEvents.length)
  return builtEvents;
};





const insertBuiltEvents = async () => {
  try {
    const builtEvents = await buildEvents(); // Replace this with your logic to build events

    for (const eventData of builtEvents) {
      const query = `
        INSERT INTO event (
            event_Title,
            event_Type,
            event_Date,
            event_Location,
            ticket_Link,
            event_Image,
            event_Djs
        )
        VALUES (
            $1, $2, $3, $4, $5, $6, $7
        )
      `;

      const values = [
        eventData.event_Title,
        eventData.event_Type,
        eventData.event_Date,
        eventData.event_Location,
        eventData.ticket_Link,
        eventData.event_Image,
        eventData.event_Djs
      ];

      const result = await pool.query(query, values);
      console.log('Inserted data:', result.rowCount);
    }
  } catch (error) {
    console.error('Error inserting data:', error);
  }
};

// Call the function to insert built events
insertBuiltEvents();




    
