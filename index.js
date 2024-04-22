const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const { requestTokenLogic } = require("./requestTokenLogic");

const app = express();
app.disable("x-powered-by");
app.use(express.json());

const PORT = process.env.PORT || 3000;
const RL_ID = process.env.RL_ID;

// Middleware para verificar la clave de API
const verifyAPIKey = (req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (apiKey && apiKey === process.env.API_KEY) {
    next();
  } else {
    res.status(401).json({ message: "Acceso no autorizado." });
  }
};

// Rutas protegidas con Middleware verifyAPIKey
// Ruta: Envío de token a correo
app.get("/requestToken", verifyAPIKey, async (req, res) => {
  if (!RL_ID) {
    return res.status(400).send("Se requiere un ID");
  }
  requestTokenLogic(res);
});

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.json({ message: "Render Puppeteer server is up and running!" });
});

app.listen(3000, () => {
  console.log(`App listening on port ${PORT}`);
});
