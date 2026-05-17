const buildPrompt = (text, sourceLang, targetLang) => {
  const systemInstruction = `You are a translator. Translate text from language code '${sourceLang}' to language code '${targetLang}'.
Translate naturally and conversationally.
ONLY return the final translated text. DO NOT generate explanations, quotes, or conversational filler before the output.`;

  const userPrompt = `Translate the following:\n"${text}"`;

  return { systemInstruction, userPrompt };
};

module.exports = { buildPrompt };
