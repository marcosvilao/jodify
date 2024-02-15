//const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-extra");
const StealthPlugin = require("puppeteer-extra-plugin-stealth");

puppeteer.use(StealthPlugin());

const linkScrap = async (link) => {
  let browser = null;
  try {
    /*
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
     */
    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });

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
      console.error(
        `No se pudo acceder a la página. Código de estado: ${statusCode}`
      );
      return {
        error: `No se pudo acceder a la página. Código de estado: ${statusCode}`,
      };
    }

    if (link.includes("passline")) {
      await page.waitForSelector("img", { timeout: 5000 });

      let dateText = null;
      let tittle = null;
      let location = null;

      const section = await page.$(".cont-head-ficha.contenedor");
      const div = await page.$(".donde");

      if (section) {
        dateText = await section.$eval("li", (li) => li.textContent.trim());
        tittle = await section.$eval("h3", (h3) => h3.textContent.trim());

        const fechaStr = String(dateText);
        const fechaSinDia = fechaStr.replace(/^[^\d]+|\s+hrs\.$/g, "");
        const [fecha, hora] = fechaSinDia.split(" - ");

        const meses = {
          Enero: "01",
          Febrero: "02",
          Marzo: "03",
          Abril: "04",
          Mayo: "05",
          Junio: "06",
          Julio: "07",
          Agosto: "08",
          Septiembre: "09",
          Octubre: "10",
          Noviembre: "11",
          Diciembre: "12",
        };

        const [dia, , mesTexto, año] = fecha.match(/\d+|[a-zA-Z]+/g);

        const numeroMes = meses[mesTexto];
        dateText = `${numeroMes}/${dia}/${año}`;
      }

      if (div) {
        location = await div.$eval("p", (p) =>
          p.textContent
            .trim()
            .replace(/\r?\n|\r/g, " - ")
            .replace(/\s+/g, " ")
        );

        let partesStringLocation = location.split(" - ");
        location = partesStringLocation[0];
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
        tittle: tittle || null,
      };

      return result;
    } else if (link.includes("venti")) {
      let dateText = null;
      let location = null;
      let jpgImgSrc = null;
      let tittle = null;

      try {
        await page.waitForSelector(".jss48", { timeout: 5000 });
        await page.waitForSelector(".jss49", { timeout: 5000 });
        await page.waitForSelector(".jss51", { timeout: 5000 });

        let divTittle = await page.$(".jss49");

        if (divTittle) {
          tittle = await divTittle.$eval("h6", (h6) => h6.textContent.trim());
        }

        const results1 = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll(".jss51"));
          let dateText = "";
          let location = "";

          elements.forEach((element) => {
            if (element.querySelector('svg[data-testid="EventIcon"]')) {
              dateText = element.textContent.trim();

              let partesFecha = dateText.split("/");
              let parteFecha1 = "";
              let parteFecha2 = "";

              if (partesFecha[1] > 9) {
                parteFecha1 = `${partesFecha[1]}`;
              } else {
                parteFecha1 = `0${partesFecha[1]}`;
              }

              if (partesFecha[0] > 9) {
                parteFecha2 = `${partesFecha[0]}`;
              } else {
                parteFecha2 = `0${partesFecha[0]}`;
              }

              dateText = `${parteFecha1}/${parteFecha2}/${partesFecha[2]}`;
            } else if (element.querySelector('svg[data-testid="PlaceIcon"]')) {
              location = element.textContent.trim();
            }
          });

          return { dateText, location };
        });

        dateText = results1.dateText;
        location = results1.location;

        jpgImgSrc = await page.evaluate(() => {
          const imgElement = document.querySelector(".jss48");
          return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
            ? imgElement.src
            : null;
        });
      } catch (error) {
        console.log(
          "Intentando con el segundo conjunto de selectores debido a: ",
          error.message
        );

        await page.waitForSelector("img", { timeout: 5000 });
        await page.waitForSelector(".jss97", { timeout: 5000 });
        await page.waitForSelector(".jss95", { timeout: 5000 });

        let divTittle = await page.$(".jss95");

        if (divTittle) {
          tittle = await divTittle.$eval("h6", (h6) => h6.textContent.trim());
        }

        const results2 = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll(".jss97"));
          let dateText = "";
          let location = "";

          elements.forEach((element) => {
            if (element.querySelector('svg[data-testid="EventIcon"]')) {
              dateText = element.textContent.trim();

              console.log(dateText);

              let partesFecha = dateText.split("/");
              let parteFecha1 = "";
              let parteFecha2 = "";

              if (partesFecha[1] > 9) {
                parteFecha1 = `${partesFecha[1]}`;
              } else {
                parteFecha1 = `0${partesFecha[1]}`;
              }

              if (partesFecha[0] > 9) {
                parteFecha2 = `${partesFecha[0]}`;
              } else {
                parteFecha2 = `0${partesFecha[0]}`;
              }

              dateText = `${parteFecha1}/${parteFecha2}/${partesFecha[2]}`;
            } else if (element.querySelector('svg[data-testid="PlaceIcon"]')) {
              location = element.textContent.trim();
            }
          });

          return { dateText, location };
        });

        dateText = results2.dateText;
        location = results2.location;

        jpgImgSrc = await page.evaluate(() => {
          const imgElement = document.querySelector(".descriptionImage");
          return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
            ? imgElement.src
            : null;
        });
      }

      return {
        image: jpgImgSrc,
        date: dateText,
        location: location,
        tittle: tittle,
      };
    }
  } catch (error) {
    console.error("Error en linkScrap:", error);
    return { error: error.message };
  } finally {
    if (browser !== null) {
      await browser.close();
    }
  }
};

module.exports = { linkScrap };
