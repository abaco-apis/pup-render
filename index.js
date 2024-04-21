const express = require("express");
const { scrapeLogic } = require("./scrapeLogic");
const app = express();

const PORT = process.env.PORT || 3000;

app.get("/scrape", (req, res) => {
  scrapeLogic(res);
});

app.get("/", (req, res) => {
  res.json({ message: "Render Puppeteer server is up and running!" });
});

app.listen(3000, () => {
  console.log(`App listening on port ${PORT}`);
});
