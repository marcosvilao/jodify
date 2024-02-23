const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-extra");
const moment = require("moment-timezone");
//const StealthPlugin = require("puppeteer-extra-plugin-stealth");

//puppeteer.use(StealthPlugin());

const linkScrap = async (link) => {
  let browser = null;
  try {
    // DEPLOY
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    /*
    // LOCAL
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
      let horario = "";

      try {
        await page.waitForSelector(".descriptionImage", { timeout: 10000 });
        await page.waitForSelector(".jss49", { timeout: 10000 });
        await page.waitForSelector(".jss51", { timeout: 10000 });

        let divTittle = await page.$(".jss49");

        if (divTittle) {
          tittle = await divTittle.$eval("h6", (h6) => h6.textContent.trim());
        }

        const results1 = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll(".jss51"));
          let dateText = "";
          let location = "";
          let horario = "";

          elements.forEach((element) => {
            if (element.querySelector('svg[data-testid="EventIcon"]')) {
              dateText = element.textContent.trim();
            } else if (element.querySelector('svg[data-testid="PlaceIcon"]')) {
              location = element.textContent.trim();
            } else if (
              element.querySelector('svg[data-testid="AccessTimeIcon"]')
            ) {
              horario = element.textContent.trim();
            }
          });

          return { dateText, location, horario };
        });

        dateText = results1.dateText;
        location = results1.location;
        horario = results1.horario;

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

        await page.waitForSelector(".descriptionImage", { timeout: 10000 });
        await page.waitForSelector(".jss97", { timeout: 10000 });
        await page.waitForSelector(".jss95", { timeout: 10000 });

        let divTittle = await page.$(".jss95");

        if (divTittle) {
          tittle = await divTittle.$eval("h6", (h6) => h6.textContent.trim());
        }

        const results2 = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll(".jss97"));
          let dateText = "";
          let location = "";
          let horario = "";

          elements.forEach((element) => {
            if (element.querySelector('svg[data-testid="EventIcon"]')) {
              dateText = element.textContent.trim();
            } else if (element.querySelector('svg[data-testid="PlaceIcon"]')) {
              location = element.textContent.trim();
            } else if (
              element.querySelector('svg[data-testid="AccessTimeIcon"]')
            ) {
              horario = element.textContent.trim();
            }
          });

          return { dateText, location, horario };
        });

        dateText = results2.dateText;
        location = results2.location;
        horario = results2.horario;

        jpgImgSrc = await page.evaluate(() => {
          const imgElement = document.querySelector(".descriptionImage");
          return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
            ? imgElement.src
            : "";
        });
      }

      let parts = dateText.split("/");
      var mesMoment;
      var dayMoment;
      var yearMoment = parts[2];

      if (parts[0].length === 1) {
        mesMoment = `0${parts[1]}`;
      } else {
        mesMoment = `${parts[0]}`;
      }

      if (parts[1].length === 1) {
        dayMoment = `0${parts[1]}`;
      } else {
        dayMoment = `${parts[1]}`;
      }

      const newDateText = `${yearMoment}-${mesMoment}-${dayMoment}`;
      let fecha = moment(newDateText);
      let fechaFormateada = fecha.format("MM-DD-YYYY");

      console.log(`Fecha del scrapping: ${dateText}`);
      console.log(`Fecha preparada para formatear: ${newDateText}`);
      console.log(`Fecha moments: ${fecha}`);
      console.log(`Fecha formateada: ${fechaFormateada}`);

      return {
        image: jpgImgSrc,
        date: fechaFormateada,
        location: location,
        tittle: tittle,
        horario: horario,
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
