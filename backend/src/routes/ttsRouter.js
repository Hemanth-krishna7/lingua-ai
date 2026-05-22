const express = require('express');
const router = express.Router();
const ttsService = require('../services/ttsService');

router.post('/', async (req, res) => {
  const { text, dialect, language, tone, speakerProfile } = req.body;

  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Text is required for speech synthesis' });
  }

  try {
    const audioBuffer = await ttsService.generateSpeech({ text, dialect, language, tone, speakerProfile });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': audioBuffer.byteLength,
      'Cache-Control': 'public, max-age=86400'
    });

    return res.send(audioBuffer);
  } catch (error) {
    // Return structured failure response so frontend can fallback gracefully
    return res.status(500).json({
      error: error.message || 'ElevenLabs TTS generation failed',
      fallback: true
    });
  }
});

module.exports = router;
