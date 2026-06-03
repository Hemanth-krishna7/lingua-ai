const DIALECT_PROFILES = require('./dialectProfiles');

const buildPrompt = (text, sourceLang, targetLang, tone = 'Standard', dialect = 'Standard') => {
  let systemInstruction = `You are a professional translator. Translate text from language code '${sourceLang}' to language code '${targetLang}'.
Translate naturally and conversationally.`;

  if (dialect && dialect !== 'Standard') {
    const profile = DIALECT_PROFILES[dialect];
    if (profile) {
      systemInstruction += `\n\nApply the following speaking style/dialect profile:\n${profile}`;
    }

    const lowerDialect = dialect.toLowerCase();
    if (lowerDialect === 'hinglish' || lowerDialect === 'hyderabadi hindi') {
      systemInstruction += `\n\nIMPORTANT: For ${dialect}, translate directly into Romanized script (Latin alphabet/English letters) using casual phonetic spellings. Real speakers write in Roman script when texting. Do NOT output Devanagari script.`;
    }
  }

  if (tone && tone !== 'Standard') {
    systemInstruction += `\n\nAdjust the tone to be strictly '${tone}'. Make sure it feels authentic and natural for that tone.`;
  }

  systemInstruction += `\n\nONLY return the final translated text. DO NOT generate explanations, quotes, introduction, or conversational filler before/after the output.`;

  const userPrompt = `Translate the following:\n"${text}"`;

  return { systemInstruction, userPrompt };
};

module.exports = { buildPrompt };
