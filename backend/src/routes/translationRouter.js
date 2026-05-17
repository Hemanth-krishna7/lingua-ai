const express = require('express');
const { translate } = require('google-translate-api-x');
const { GoogleGenAI } = require('@google/genai');
const { buildPrompt } = require('../ai/promptBuilder');
const { applyDialect } = require('../ai/dialectTransformer');

const router = express.Router();

router.post('/', async (req, res) => {
  let finalOutput = "";

  try {
    console.log("[STEP 1] Request received");
    const { q, source, target, tone, dialect } = req.body;

    if (!q || !source || !target) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const isStandard = (!tone || tone === 'Standard') && (!dialect || dialect === 'Standard');
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!isStandard && !apiKey) {
      console.error('[CRITICAL ERROR] GEMINI_API_KEY is missing');
      return res.status(500).json({ error: 'GEMINI_API_KEY is missing' });
    }

    if (!isStandard) {
      const ai = new GoogleGenAI({ apiKey });
      const { systemInstruction, userPrompt } = buildPrompt(q, source, target);

      // Stage 1: Base Translation
      let baseText = null;
      try {
        const response1 = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: userPrompt,
          config: {
            systemInstruction: systemInstruction,
            temperature: 0.3,
          }
        });
        baseText = response1.text ? String(response1.text).trim() : null;
        console.log("[STEP 2] Base translation success");
        console.log("baseText content:", baseText);
        console.log("typeof baseText:", typeof baseText);
      } catch (err) {
        console.error("[TRANSLATION STAGE FAILED]", err.stack || err);
        // Fallback to standard translation if Gemini completely fails
        const fallbackResult = await translate(q, { from: source, to: target });
        baseText = fallbackResult && fallbackResult.text ? String(fallbackResult.text).trim() : q;
      }

      if (!baseText) {
        baseText = q; // Ultimate fallback
      }

      // Stage 2: Dialect Transformation
      let transformedText = baseText;
      try {
        console.log("[STEP 3] Applying dialect");
        const dialectResult = applyDialect(baseText, dialect);
        if (dialectResult && typeof dialectResult === 'string') {
          transformedText = String(dialectResult).trim();
          console.log("[STEP 4] Dialect transform success");
        } else {
          console.log("[STEP 4] Dialect transform returned invalid output");
        }
        console.log("transformedText content:", transformedText);
        console.log("typeof transformedText:", typeof transformedText);
      } catch (err) {
        console.error("[DIALECT STAGE FAILED]", err.stack || err);
        transformedText = baseText; // Fallback to base text on failure
      }

      // Stage 3: Preparing Response
      try {
        console.log("[STEP 5] Preparing response");
        finalOutput = transformedText;
      } catch (err) {
        console.error("[PREPARATION STAGE FAILED]", err.stack || err);
        finalOutput = baseText;
      }

    } else {
      // Standard flow
      let result = null;
      try {
        result = await translate(q, { from: source, to: target });
      } catch (err) {
        console.error("[STANDARD TRANSLATION FAILED]", err.stack || err);
      }
      
      if (result && typeof result.text === 'string') {
        finalOutput = String(result.text).trim();
      } else {
        finalOutput = q; // Fallback to original text
      }
    }

  } catch (error) {
    console.error('\n[CRITICAL EXCEPTION] OUTER PIPELINE ERROR:\n', error.stack || error);
    // If outer pipeline fails completely, ensure we don't crash and leave finalOutput empty.
  }

  // Final Stage: Serialization and Sending Response (Executes exactly ONCE)
  try {
    console.log("[STEP 6] Response sent");
    return res.json({
       translatedText: String(finalOutput || "").trim()
    });
  } catch (err) {
    console.error("[FINAL SERIALIZATION FAILED]", err.stack || err);
    // Absolute fallback to avoid 500 crashes
    return res.json({
       translatedText: "An error occurred, but the system prevented a crash."
    });
  }
});

module.exports = router;
