const express = require('express');
const cors = require('cors');
const { translate } = require('google-translate-api-x');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('LinguaAI Backend Running');
});

// Translation Route
app.post('/api/translate', async (req, res) => {
  try {

    const { q, source, target } = req.body;

    if (!q || !source || !target) {
      return res.status(400).json({
        error: 'Missing required fields',
      });
    }

    console.log('Incoming Request:', req.body);

    // Google Translate
    const result = await translate(q, {
      from: source,
      to: target,
    });

    console.log('Translated:', result.text);

    res.json({
      translatedText: result.text,
    });

  } catch (error) {

    console.error('TRANSLATION ERROR:', error.message);

    res.status(500).json({
      error: 'Translation failed',
    });
  }
});

// Health Route
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
