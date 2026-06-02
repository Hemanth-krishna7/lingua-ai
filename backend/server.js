process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

require('dotenv').config();

const express = require('express');
const cors = require('cors');

const translationRouter = require('./src/routes/translationRouter');
const ttsRouter = require('./src/routes/ttsRouter');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('LinguaAI Backend Running');
});

// Mount Routes
app.use('/api/translate', translationRouter);
app.use('/api/tts', ttsRouter);

// Empty to remove old /api/translate route

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
