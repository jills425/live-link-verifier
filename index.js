const express = require('express');
const axios = require('axios');

const app = express();
app.use(express.json());

// New: Add a GET route at /
app.get('/', (req, res) => {
  res.send('Server is running.');
});

app.post('/check-link', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).send({ status: 'Error', message: 'No URL provided' });
  }

  try {
    const response = await axios.get(url, { timeout: 5000 });
    if (response.status === 200) {
      res.send({ status: 'Alive' });
    } else {
      res.send({ status: 'Error', code: response.status });
    }
  } catch (error) {
    res.send({ status: 'Dead' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
