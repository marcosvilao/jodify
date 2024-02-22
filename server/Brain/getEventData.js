const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-extra");
//const StealthPlugin = require("puppeteer-extra-plugin-stealth");

//puppeteer.use(StealthPlugin());

const linkScrap = async (link) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });
    /*
    browser = await puppeteer.launch({
      executablePath:
        "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      headless: true,
    });
    */

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

      let dateText = "";
      let tittle = "";
      let location = "";

      const section = await page.$(".cont-head-ficha.contenedor");
      const div = await page.$(".donde");

      if (section) {
        try {
          dateText = await section.$eval("li", (li) => li.textContent.trim());

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
        } catch (error) {
          console.log(error);
          dateText = "";
        }

        try {
          tittle = await section.$eval("h3", (h3) => h3.textContent.trim());
        } catch (error) {
          console.log(error);
          tittle = "";
        }
      }

      if (div) {
        try {
          location = await div.$eval("p", (p) =>
            p.textContent
              .trim()
              .replace(/\r?\n|\r/g, " - ")
              .replace(/\s+/g, " ")
          );
        } catch (error) {
          location = "";
        }

        let partesStringLocation = location.split(" - ");
        location = partesStringLocation[0];
      }

      try {
        var jpgImgSrc = await page.evaluate(() => {
          const imgElements = Array.from(document.querySelectorAll("img"));
          for (const img of imgElements) {
            const src = img.getAttribute("src");
            if (src && src.toLowerCase().endsWith(".jpg")) {
              return src;
            }
          }
          return "";
        });
      } catch (error) {
        console.log(error);
        var jpgImgSrc = "";
      }

      const result = {
        image: jpgImgSrc || "",
        date: dateText || "",
        location: location || "",
        tittle: tittle || "",
      };

      return result;
    } else if (link.includes("venti")) {
      let dateText = "";
      let location = "";
      let jpgImgSrc = "";
      let tittle = "";

      try {
        await page.waitForSelector(".descriptionImage", { timeout: 5000 });
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
            } else if (element.querySelector('svg[data-testid="PlaceIcon"]')) {
              location = element.textContent.trim();
            }
          });

          return { dateText, location };
        });

        dateText = results1.dateText;
        location = results1.location;

        jpgImgSrc = await page.evaluate(() => {
          const imgElement = document.querySelector(".descriptionImage");
          return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
            ? imgElement.src
            : "";
        });
      } catch (error) {
        console.log(
          "Intentando con el segundo conjunto de selectores debido a: ",
          error.message
        );

        await page.waitForSelector(".descriptionImage", { timeout: 5000 });
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
            : "";
        });
      }

      const date = new Date(dateText + "T12:00:00");

      const options = {
        day: "2-digit", // Día en dos dígitos
        month: "2-digit", // Mes en dos dígitos
        year: "numeric", // Año en formato numérico
      };

      console.log(`Date: ${date}`);
      console.log(`Date Text: ${dateText}`);
      const formateDate = date.toLocaleDateString("en-US", options);
      console.log(`Formate Date: ${formateDate}`);

      return {
        image: jpgImgSrc,
        date: formateDate,
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
