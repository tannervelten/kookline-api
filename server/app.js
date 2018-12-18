const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

app.get('/', (req, res) => {
  res.send('Welcome to kookline api! Navigate to /example for example data or /spots/:id for a specific forecast.')
});

app.get('/example', async (req, res) => {
  try {
    const result = await axios.get('https://api.surfline.com/v1/forecasts/4750');
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.get('/spots/:id', async (req, res) => {
  try {
    const result = await axios.get(`https://api.surfline.com/v1/forecasts/${req.params.id}`);
    res.status(200).json(result.data);
  } catch (err) {
    res.status(400).json(err);
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
