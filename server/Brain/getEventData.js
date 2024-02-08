//const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const puppeteer = require("puppeteer-core");
const chromium = require("chrome-aws-lambda");

//puppeteer.use(StealthPlugin());

const linkScrap = async (link) => {
  /*
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      devtools: false, // Actualizado para quitar la apertura de devtools
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-web-security",
        "--disable-features=IsolateOrigins,site-per-process",
        "--flag-switches-begin --disable-site-isolation-trials --flag-switches-end",
      ],
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    });
  } catch (error) {
    console.log(error);
    return;
  }
  */
  let browser;
  try {
    browser = await puppeteer.launch({
      executablePath: await chromium.executablePath,
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      headless: chromium.headless,
    });
  } catch (error) {
    console.log(error);
    return;
  }
  try {
    const page = await browser.newPage();
    /*
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
    );
    */
    await page.setUserAgent(chromium.userAgent);

    const response = await page.goto(link, {
      waitUntil: "domcontentloaded",
      timeout: 0,
    });
    const statusCode = response.status();

    if (statusCode !== 200) {
      throw new Error(
        `No se pudo acceder a la página. Código de estado: ${statusCode}`
      );
    }

    if (link.includes("passline")) {
      await page.waitForSelector("img", { timeout: 30000 });

      let dateText = null;
      let location = null;

      const section = await page.$(".cont-head-ficha.contenedor");
      const div = await page.$(".donde");

      if (section) {
        dateText = await section.$eval("li", (li) => li.textContent.trim());
      }

      if (div) {
        location = await div.$eval("p", (p) =>
          p.textContent
            .trim()
            .replace(/\r?\n|\r/g, " - ")
            .replace(/\s+/g, " ")
        );
      }

      const jpgImgSrc = await page.evaluate(() => {
        const imgElements = Array.from(document.querySelectorAll("img"));
        for (const img of imgElements) {
          const src = img.getAttribute("src");
          if (src && src.toLowerCase().endsWith(".jpg")) {
            return src;
          }
        }
        return null;
      });

      const result = {
        image: jpgImgSrc || null,
        date: dateText || null,
        location: location || null,
      };

      return result;
    } else if (link.includes("venti")) {
      await page.waitForSelector("img", { timeout: 30000 });
      await page.waitForSelector(".jss97", { timeout: 30000 });

      const results = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll(".jss97"));
        let dateText = "";
        let location = "";

        elements.forEach((element) => {
          if (element.querySelector('svg[data-testid="EventIcon"]')) {
            dateText = element.textContent.trim();
          } else if (element.querySelector('svg[data-testid="PlaceIcon"]')) {
            location = element.textContent.trim();
          }
        });

        return { dateText, location };
      });

      dateText = results.dateText;
      location = results.location;

      const jpgImgSrc = await page.evaluate(() => {
        const imgElement = document.querySelector(".descriptionImage");
        if (imgElement && imgElement.src.toLowerCase().endsWith(".jpg")) {
          return imgElement.src;
        }
        return null;
      });

      const result = {
        image: jpgImgSrc,
        date: dateText,
        location: location,
      };

      return result;
    }
  } catch (error) {
    console.error(error);
    return {
      error: error,
    };
  } finally {
    await browser.close();
  }
};

module.exports = {
  linkScrap,
};
