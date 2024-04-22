const puppeteer = require("puppeteer");
require("dotenv").config();

const RL_ID = process.env.RL_ID;
const NIT = process.env.NIT;

const requestTokenLogic = async (res) => {
  // Launch the browser
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath:
      process.env.NODE_ENV === "production"
        ? process.env.PUPPETEER_EXECUTABLE_PATH
        : puppeteer.executablePath(),
  });
  try {
    // Open a new blank page
    const page = await browser.newPage();

    // Navegar a la página de inicio de sesión de personas
    await page.goto("https://catalogo-vpfe.dian.gov.co/User/CompanyLogin");

    // Hacer click en 'Representante Legal'
    await page.click("#legalRepresentative");

    // Esperar a que el formulario de inicio de sesión sea visible
    await page.waitForSelector('form[method="post"]', { visible: true });

    // Seleccionar el tipo de identificación
    // Asumiendo que el ID del selector es "PersonIdentificationType" basado en el HTML de la página
    await page.select("#CompanyIdentificationType", "10910094"); // '10910094' corresponde a 'Cédula de ciudadanía'

    // Introducir el número de cédula en el campo correspondiente
    // Asumiendo que el id del campo es "UserCode" basado en el HTML de la página
    await page.type("#UserCode", `${RL_ID}`, { delay: 100 });

    // Introducir el número de NIT en el campo correspondiente
    // Asumiendo que el id del campo es "CompanyCode" basado en el HTML de la página
    await page.type("#CompanyCode", `${NIT}`, { delay: 100 });
    // Hacer clic en el botón de enviar el formulario
    await page.click("button.btn.btn-primary");

    // Envía una respuesta
    res.json({ message: "Token solicitado" });
  } catch (e) {
    console.error(e);
    res.send(`Something went wrong while requesting token: ${e}`);
  } finally {
    await browser.close();
  }
};

module.exports = { requestTokenLogic };
