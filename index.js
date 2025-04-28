const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// Updated link checker
app.post('/check-link', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ status: 'Error', message: 'No URL provided' });
  }

  try {
    const response = await axios.get(url, { timeout: 7000 });

    const htmlContent = response.data.toLowerCase();

    // Check for soft 404 indicators
    const soft404Indicators = [
      "page not found",
      "404 error",
      "not available",
      "sorry, we couldn't find",
      "this page no longer exists",
      "error 404",
      "site not found",
      "content not available",
      "activity not found"
    ];

    const isSoft404 = soft404Indicators.some(indicator => htmlContent.includes(indicator));

    if (response.status === 200 && !isSoft404) {
      res.send({ status: 'Alive' });
    } else {
      res.send({ status: 'Dead' });
    }

  } catch (error) {
    res.send({ status: 'Dead' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Live Link Verifier upgraded and running on port ${PORT}`);
});
