const express = require('express');
const axios = require('axios');
const cors = require('cors');
const puppeteer = require('puppeteer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

async function getSurflineData(url) {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.goto(url);

  const data = await page.evaluate(() => {
    const swells = Array.from(document.querySelector('#root > div > div > div > div > div.sl-spot-current-conditions-section.sl-spot-current-conditions-section--with-cam.sl-spot-current-conditions-section--with-report.sl-spot-current-conditions-section--free > div:nth-child(2) > div.sl-spot-module.sl-spot-module--with-cam > div > div.sl-spot-report__content-wrapper > div.sl-spot-report__condition-values.sl-spot-report__condition-values--with-report > div > div.sl-spot-forecast-summary__wrapper > div:nth-child(4) > div > div.sl-spot-forecast-summary__stat-swells').children).map(child => child.innerText);
    return {
      title: document.querySelector('#root > div > div > div > div > div.quiver-content-container > div > div.sl-forecast-header__main > h1').innerText.replace(' Surf Report & Forecast', ''),
      swells,
      surfHeight: document.querySelector('#root > div > div > div > div > div.sl-spot-current-conditions-section.sl-spot-current-conditions-section--with-cam.sl-spot-current-conditions-section--with-report.sl-spot-current-conditions-section--free > div:nth-child(2) > div.sl-spot-module.sl-spot-module--with-cam > div > div.sl-spot-report__content-wrapper > div.sl-spot-report__condition-values.sl-spot-report__condition-values--with-report > div > div.sl-spot-forecast-summary__wrapper > div:nth-child(1) > div > span').innerText,
      tide: document.querySelector('#root > div > div > div > div > div.sl-spot-current-conditions-section.sl-spot-current-conditions-section--with-cam.sl-spot-current-conditions-section--with-report.sl-spot-current-conditions-section--free > div:nth-child(2) > div.sl-spot-module.sl-spot-module--with-cam > div > div.sl-spot-report__content-wrapper > div.sl-spot-report__condition-values.sl-spot-report__condition-values--with-report > div > div.sl-spot-forecast-summary__wrapper > div:nth-child(2) > div > div.sl-spot-forecast-summary__stat-reading > span').innerText,
      wind: document.querySelector('#root > div > div > div > div > div.sl-spot-current-conditions-section.sl-spot-current-conditions-section--with-cam.sl-spot-current-conditions-section--with-report.sl-spot-current-conditions-section--free > div:nth-child(2) > div.sl-spot-module.sl-spot-module--with-cam > div > div.sl-spot-report__content-wrapper > div.sl-spot-report__condition-values.sl-spot-report__condition-values--with-report > div > div.sl-spot-forecast-summary__wrapper > div:nth-child(3) > div > div.sl-spot-forecast-summary__stat-reading > span').innerText,
    };
  });
  await browser.close();

  return data;
}

app.get('/', (req, res) => {
  res.send(`<h1>Welcome to kookline api!</h1><li><a href="${process.env.URL}el-porto/5842041f4e65fad6a7708906">El Porto</a></li><li><a href="${process.env.URL}county-line/5842041f4e65fad6a7708813">County Line</a></li><li><a href="${process.env.URL}malibu-second-to-third-point/5842041f4e65fad6a7708817">Malibu</a></li>`)
});

app.get('/:spot/:hash', async (req, res) => {
  const url = `https://www.surfline.com/surf-report/${req.params.spot}/${req.params.hash}`;
  try {
    const result = await getSurflineData(url);
    res.json(result);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

app.get('/example', async (req, res) => {
  try {
    const result = await axios.get('https://api.surfline.com/v1/forecasts/4750');
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get('/surfline/:id', async (req, res) => {
  try {
    const result = await axios.get(`https://api.surfline.com/v1/forecasts/${req.params.id}`);
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get('*', (req, res) => {
  res.status(404).send('Error not found');
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
