const chromium = require("@sparticuz/chromium");
const puppeteer = require("puppeteer-extra");
const moment = require("moment-timezone");
require("dotenv").config();

const linkScrap = async (link) => {
  const SCRAPPING = process.env.SCRAPPING;
  let browser = null;
  try {
    if (SCRAPPING) {
      browser = await puppeteer.launch({
        args: chromium.args,
        defaultViewport: chromium.defaultViewport,
        executablePath: await chromium.executablePath(),
        headless: chromium.headless,
        ignoreHTTPSErrors: true,
      });
    } else {
      browser = await puppeteer.launch({
        executablePath:
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
        headless: true,
      });
    }

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

    if (link.includes("ticketpass")) {
      await page.waitForSelector("img", { timeout: 10000 }); // Espera hasta 10 segundos.
      let dateText = "";
      let tittle = "";
      let location = "";

      const sectionTittleFecha = await page.$(".event-card__container-title");
      const sectionLocation = await page.$(".event-card__tag-location");

      if (sectionTittleFecha) {
        try {
          tittle = await sectionTittleFecha.$eval("h3", (h3) =>
            h3.textContent.trim()
          );

          dateText = await sectionTittleFecha.$eval("h6", (h6) =>
            h6.textContent.trim()
          );

          var partes = dateText.split(" ");
          console.log(partes);
          var dia = partes[1];
          var mes = partes[3].toLowerCase();
          var año = partes[4];

          var meses = {
            enero: "01",
            febrero: "02",
            marzo: "03",
            abril: "04",
            mayo: "05",
            junio: "06",
            julio: "07",
            agosto: "08",
            septiembre: "09",
            octubre: "10",
            noviembre: "11",
            dateTexticiembre: "12",
          };

          var mesNumero = meses[mes];
          var fechaFormateada = mesNumero + "-" + dia + "-" + año;

          dateText = fechaFormateada;
        } catch (error) {
          tittle = "";
          dateText = "";
          console.log(error);
        }
      }

      if (sectionLocation) {
        try {
          location = await sectionLocation.evaluate((p) =>
            p.textContent.trim()
          );
        } catch (error) {
          location = "";
          console.log(error);
        }
      }

      try {
        var imageSrc = await page.evaluate(() => {
          const imgElements = Array.from(document.querySelectorAll("img"));
          for (const img of imgElements) {
            const src = img.getAttribute("src");
            if (src && src.includes("cloudfront.net")) {
              // Buscar una imagen que contenga "cloudfront.net" en su URL
              // Si la URL ya es absoluta y contiene el dominio deseado, devuélvela directamente
              return src.startsWith("http")
                ? src
                : `https://www.ticketpass.com.ar${src}`;
            }
          }
          return "";
        });
      } catch (error) {
        imageSrc = "";
        console.error(error);
      }

      const result = {
        image: imageSrc || "",
        date: dateText || "",
        location: location || "",
        tittle: tittle || "",
      };

      return result;
    } else if (link.includes("passline")) {
      await page.waitForSelector("img", { timeout: 10000 });

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
          tittle = await section.$eval("h1", (h1) => h1.textContent.trim());
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
        await page.waitForSelector(".jss96", { timeout: 10000 });
        await page.waitForSelector(".jss97", { timeout: 10000 });
        await page.waitForSelector(".jss99", { timeout: 10000 });

        let divTittle = await page.$(".jss97");
        if (divTittle) {
          try {
            tittle = await divTittle.$eval("h6", (h6) => h6.textContent.trim());
          } catch (error) {
            tittle = "";
            console.log(error);
          }
        }

        try {
          jpgImgSrc = await page.evaluate(() => {
            const imgElement = document.querySelector(".jss96");
            return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
              ? imgElement.src
              : "";
          });
        } catch (error) {
          jpgImgSrc = "";
          console.log(error);
        }

        const results1 = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll(".jss99"));
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
      } catch (error) {
        console.log(error);
        await page.waitForSelector(".jss49", { timeout: 10000 });
        await page.waitForSelector(".jss50", { timeout: 10000 });
        await page.waitForSelector(".jss52", { timeout: 10000 });

        let divTittle = await page.$(".jss50");
        if (divTittle) {
          try {
            tittle = await divTittle.$eval("h6", (h6) => h6.textContent.trim());
          } catch (error) {
            tittle = "";
            console.log(error);
          }
        }

        try {
          jpgImgSrc = await page.evaluate(() => {
            const imgElement = document.querySelector(".jss49");
            return imgElement && imgElement.src.toLowerCase().endsWith(".jpg")
              ? imgElement.src
              : "";
          });
        } catch (error) {
          jpgImgSrc = "";
          console.log(error);
        }

        const results1 = await page.evaluate(() => {
          const elements = Array.from(document.querySelectorAll(".jss52"));
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
      }

      if (dateText.length) {
        let parts = dateText.split("/");
        var mesMoment;
        var dayMoment;
        var yearMoment = parts[2];

        if (parts[0].length === 1) {
          mesMoment = `0${parts[0]}`;
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

        return {
          image: jpgImgSrc,
          date: fechaFormateada,
          location: location,
          tittle: tittle,
          horario: horario,
        };
      } else {
        return {
          image: jpgImgSrc,
          date: dateText,
          location: location,
          tittle: tittle,
          horario: horario,
        };
      }
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
