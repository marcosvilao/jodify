const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const linkScrap = async (link) => {
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
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36"
    );

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

    await page.waitForSelector("img", { timeout: 30000 });

    let dateText = null;

    if (link.includes("passline")) {
      const section = await page.$(".cont-head-ficha.contenedor");
      if (section) {
        dateText = await section.$eval("li", (li) => li.textContent.trim());
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

      if (dateText === null) {
        const dateRegex = /\d{2}\/\d{1,2}\/\d{4}/;
        const pageText = await page.evaluate(() => document.body.textContent);
        const firstDateMatch = pageText.match(dateRegex);
        if (firstDateMatch) {
          dateText = firstDateMatch[0];
        }
      }

      const result = {
        image: jpgImgSrc || null,
        date: dateText || null,
      };

      console.log(result);

      return result;
    }
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
  linkScrap,
};
