const puppeteer = require('puppeteer');


const linkScrap = async (link) => {
    let browser
    try {
        browser = await puppeteer.launch({
            headless: true,
            devtools: true,
            args: [
                '--disable-web-security',
                '--disable-features=IsolateOrigins',
                '--disable-site-isolation-trials'
            ]
        })
    } catch (error) {
        console.log(error)
    }
    try {
      const page = await browser.newPage();
      const response = await page.goto(link);
      const statusCode = response.status();
  
      if (statusCode !== 200) {
        throw new Error(`Page could not be accessed. Status code: ${statusCode}`);
      }
  
      // Wait for the page to load completely (you can adjust the timeout as needed)
      await page.waitForSelector('img');

      let dateText = null;

      // Check if the link contains the word "passline"
      if (link.includes('passline')) {

        const section = await page.$('.cont-head-ficha.contenedor');
        if (section) {
          // Extract the date text from the section
          dateText = await section.$eval('li', (li) => li.textContent.trim());
        }
      }
  
      // Find the first JPG image link
      const jpgImgSrc = await page.evaluate(() => {
        const imgElements = Array.from(document.querySelectorAll('img'));
        for (const img of imgElements) {
          const src = img.getAttribute('src');
          if (src && src.toLowerCase().endsWith('.jpg')) {
            return src;
          }
        }
        return null; // Return null if no JPG image is found
      });
      // Find the first date in dd/mm/yyyy format
      if(dateText === null) {
        const dateRegex = /\d{2}\/\d{1,2}\/\d{4}/;
        const pageText = await page.evaluate(() => document.body.textContent);
        const firstDateMatch = pageText.match(dateRegex);
        if(firstDateMatch){
            dateText = firstDateMatch[0]
            const dateComponents = dateText.split('/');

        if (dateComponents.length === 3) {
          const month = dateComponents[0];
          const day = dateComponents[1];
          const year = dateComponents[2];

          // Format the date in DD/MM/YYYY format
          dateText = `${day}/${month}/${year}`;

        }
        }
      } else {
        const monthMapping = {
            "Enero": "01",
            "Febrero": "02",
            "Marzo": "03",
            "Abril": "04",
            "Mayo": "05",
            "Junio": "06",
            "Julio": "07",
            "Agosto": "08",
            "Septiembre": "09",
            "Octubre": "10",
            "Noviembre": "11",
            "Diciembre": "12"
          };

          const dateRegex = /(\d{1,2}) de (\w+) (\d{4})/;
          const match = dateText.match(dateRegex);

          if (match) {
            const day = match[1];
            const month = match[2];
            const year = match[3];
            
            // Convert month to its numeric representation using the monthMapping dictionary
            const monthNumeric = monthMapping[month];
            
            // Format the date in the desired format (DD/MM/YYYY)
            const formattedDate = `${day}/${monthNumeric}/${year}`;
            dateText = formattedDate
          } else {
            console.log("Date format not recognized.");
          }
      }
  
      // Create the result object
      const result = {
        image: jpgImgSrc || null,
        date: dateText ? dateText : null,
      };

      return result;
    } catch (error) {
      console.error(error);
      return {
        image: null,
        date: null,
      };
    } finally {
      await browser.close();
    }
  };


  module.exports = {
    linkScrap
  }
