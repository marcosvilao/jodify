const { chromium } = require("playwright");

const linkScrap = async (link) => {
  const browserServer = await chromium.launchServer();
  const wsEndpoint = browserServer.wsEndpoint();
  const browser = await chromium.connect({
    wsEndpoint,
  });
  try {
    const page = await browser.newPage();
    await page.goto(link, { waitUntil: "domcontentloaded" });
    let result = {};
    if (link.includes("passline")) {
      let evaluate = await page.evaluate();
      console.log(evaluate);

      await page.waitForSelector("img", { timeout: 30000 });
      const section = await page.$(".cont-head-ficha");
      const div = await page.$(".donde");

      const dateText = section
        ? await section.$eval("li", (li) => li.textContent.trim())
        : null;
      const location = div
        ? await div.$eval("p", (p) =>
            p.textContent
              .trim()
              .replace(/\r?\n|\r/g, " - ")
              .replace(/\s+/g, " ")
          )
        : null;

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

      result = { image: jpgImgSrc, date: dateText, location: location };
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

      const jpgImgSrc = await page.evaluate(() => {
        const imgElement = document.querySelector(".descriptionImage");
        return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
          ? imgElement.src
          : null;
      });

      result = { ...results, image: jpgImgSrc };
    }
    return result;
  } catch (error) {
    console.error("An error occurred:", error);
    throw error;
  } finally {
    await browser.close();
  }
};

module.exports = { linkScrap };
