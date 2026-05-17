process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const translationRouter = require('./src/routes/translationRouter');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Root Route
app.get('/', (req, res) => {
  res.send('LinguaAI Backend Running');
});

// Mount Routes
app.use('/api/translate', translationRouter);

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
