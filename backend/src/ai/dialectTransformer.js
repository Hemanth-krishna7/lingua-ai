const { transliterateHindi } = require('./hindiTransliterator');

function safeReplace(text, replacements) {
  try {
    if (!text || typeof text !== "string") {
      return "";
    }
    let transformed = text;
    for (const [key, value] of Object.entries(replacements)) {
      if (typeof key === "string" && typeof value === "string") {
        transformed = transformed.split(key).join(value);
      }
    }
    return String(transformed || "").trim();
  } catch (err) {
    console.error("[safeReplace Error]", err);
    return String(text || "").trim();
  }
}

function transformHinglish(text) {
  try {
    if (!text || typeof text !== "string") {
      return "";
    }
    const replacements = {
      // ── Full-sentence patterns (most specific — match first) ──────────────
      'चिंता मत करो, मैं संभाल लूंगा': 'Tension mat le yaar, main dekh lunga',
      'चिंता मत करो, मैं सम्भाल लूँगा': 'Tension mat le yaar, main dekh lunga',
      'बाद में बात करते हैं': 'baad mein baat karte hai',
      'बाद में मिलते हैं': 'baad mein milte hai',
      'कृपया मुझे कॉल करें': 'please mujhe call karna',
      'मैं ऑफिस जा रहा हूँ': 'main office ja raha hoon',
      'मैं ऑफिस जा रहा हु': 'main office ja raha hoon',
      'क्या कर रहे हो': 'kya kar raha hai',
      'कल मिलते हैं': 'kal milte hai',
      'थोड़ा रुको': 'ek second ruk',
      'कोई बात नहीं': 'no worries',
      'फ़िक्र मत करो': 'fikar mat kar',
      'सब ठीक है': 'sab theek hai',
      'समझ गया': 'samjh gaya',
      'पता नहीं': 'pata nahi',
      'देख लेना': 'dekh lena',
      'मैं देख लूंगा': 'main dekh lunga',
      'मैं संभाल लूंगा': 'main dekh lunga',
      'मैं सम्भाल लूँगा': 'main dekh lunga',
      'जल्दी करो': 'jaldi kar yaar',
      'मुझे कॉल करें': 'mujhe call karna',
      // ── Multi-word phrases ────────────────────────────────────────────────
      'बहुत अच्छा': 'bahut accha',
      'बहुत बढ़िया': 'bahut badhiya',
      'बिल्कुल सही': 'ekdum sahi',
      'चिंता मत': 'tension mat le',
      'मज़ाक मत करो': 'joke mat kar',
      'हाँ यार': 'haan yaar',
      'अरे यार': 'are yaar',
      'ठीक है': 'theek hai',
      'सच में': 'seriously',
      'भेज दो': 'bhej de',
      'बता दो': 'bata de',
      'देख लो': 'dekh le',
      'आ जाओ': 'aaja',
      'चले जाओ': 'chale jao',
      // ── Single words (least specific — match last) ────────────────────────
      'नमस्ते': 'hey',
      'अलविदा': 'bye',
      'धन्यवाद': 'thanks',
      'माफ़ करना': 'sorry',
      'कृपया': 'please',
      'बिल्कुल': 'bilkul',
      'मज़ाक': 'joke',
      'चिंता': 'tension',
      'दोस्त': 'yaar',
      'मित्र': 'bro',
      'सुनो': 'sun',
      'बताओ': 'bata',
      'रुको': 'ruk',
    };
    return safeReplace(text, replacements);
  } catch (err) {
    console.error("[transformHinglish Error]", err);
    return String(text || "").trim();
  }
}

function transformHyderabadiHindi(text) {
  try {
    if (!text || typeof text !== "string") {
      return "";
    }
    const replacements = {
      // ── Full-sentence patterns (most specific — match first) ──────────────
      'चिंता मत करो, मैं संभाल लूंगा': 'Tension nakko le miya, main dekh leta',
      'चिंता मत करो, मैं सम्भाल लूँगा': 'Tension nakko le miya, main dekh leta',
      'हाँ मैं आ रहा हूँ': 'hau miya, aa raha hoon',
      'हाँ मैं आ रहा हु': 'hau miya, aa raha hoon',
      'क्या हो रहा है': 'kya chalra miya',
      'क्या चल रहा है': 'kya chalra miya',
      'क्या कर रहे हो': 'kaiku aisa karre miya',
      'कहाँ जा रहे हो': 'kidhar jaare ustad',
      'पागल है क्या': 'kirik hai kya',
      'कोई बात नहीं यार': 'koi baat nai miya',
      'कोई बात नहीं भाई': 'koi baat nai miya',
      'कोई बात नहीं': 'koi baat nai',
      'सब ठीक है': 'sab sahi hai',
      'जल्दी करो': 'jaldi kar, time waste nakko kar',
      'इधर आओ': 'idhar aa potti',
      'समझ गया': 'samjh gaya miya',
      'पता नहीं': 'pata nai miya',
      'मैं देख लूंगा': 'main dekh leta hun miya',
      'मैं संभाल लूंगा': 'main dekh leta hun miya',
      'मैं सम्भाल लूँगा': 'main dekh leta hun miya',
      'देख लेना': 'dekh lena miya',
      // ── Multi-word phrases ────────────────────────────────────────────────
      'बहुत अच्छा': 'ek dum bhaari',
      'बहुत बढ़िया': 'ek dum bhaari',
      'बिल्कुल सही': 'ekdum sahi',
      'चिंता मत': 'tension nakko le',
      'ठीक है': 'sahi hai',
      'हाँ यार': 'hau miya',
      'हाँ भाई': 'hau miya',
      'सच में': 'sach mein bolra',
      'मज़ाक मत करो': 'joke nakko kar',
      'क्यों नहीं': 'kaiku nai',
      'आ जाओ': 'aa potti',
      // ── Single words (least specific — match last) ────────────────────────
      'नहीं': 'nai',
      'हाँ': 'hau',
      'मत': 'nakko',
      'क्यों': 'kaiku',
      'भाई': 'miya',
      'यार': 'miya',
      'दोस्त': 'ustad',
      'पागल': 'kirik',
      'कहाँ': 'kidhar',
      'अच्छा': 'sahi',
      'सुनो': 'sun',
      'बताओ': 'bata',
      'रुको': 'ruk',
      'आओ': 'aa',
    };
    return safeReplace(text, replacements);
  } catch (err) {
    console.error("[transformHyderabadiHindi Error]", err);
    return String(text || "").trim();
  }
}

function transformAnimeJapanese(text) {
  try {
    if (!text || typeof text !== "string") {
      return "";
    }
    const replacements = {
      'おはようございます': 'おっす！',
      'こんにちは': 'よお！',
      'さようなら': 'じゃあな！',
      'ありがとうございます': 'サンキューな！',
      'すみません': 'わりぃな！',
      '本当ですか': 'マジかよ！？',
      'よろしくお願いします': 'よろしくな！',
      '頑張ります': 'やってやるぜ！',
      'です': 'だぜ',
      'ます': 'るぞ',
      'ました': 'たな',
      'ましょう': 'ようぜ',
      'ください': 'くれよ',
      '私': 'オレ',
      'あなた': 'お前'
    };
    return safeReplace(text, replacements);
  } catch (err) {
    console.error("[transformAnimeJapanese Error]", err);
    return String(text || "").trim();
  }
}

function applyDialect(text, dialect) {
  try {
    if (!text || typeof text !== 'string') {
      return "";
    }

    const safeText = String(text).trim();
    if (safeText.length === 0) {
      return "";
    }

    if (!dialect || typeof dialect !== 'string') {
      return safeText;
    }

    console.log('[DIALECT INPUT]', safeText);
    
    const normalizedDialect = dialect.toLowerCase().trim();
    console.log('[NORMALIZED DIALECT]', normalizedDialect);

    console.log('[TRANSFORM START]');
    
    let result;
    switch(normalizedDialect) {
      case "hinglish":
      case "hinglish hindi":
        result = transformHinglish(safeText);
        result = transliterateHindi(result);  // Romanise remaining Devanagari
        break;

      case "hyderabadi hindi":
      case "hyderabadi":
        result = transformHyderabadiHindi(safeText);
        result = transliterateHindi(result);  // Romanise remaining Devanagari
        break;

      case "anime":
      case "anime casual":
      case "japanese anime":
        result = transformAnimeJapanese(safeText);
        break;

      default:
        result = safeText;
        break;
    }

    if (!result || typeof result !== 'string') {
      console.log('[TRANSFORM FAILURE]');
      return safeText;
    }

    console.log('[TRANSFORM SUCCESS]');
    return String(result).trim();
    
  } catch (error) {
    console.error('[DIALECT TRANSFORMER ERROR] Exception during transformation:', error);
    console.log('[TRANSFORM FAILURE]');
    return String(text || "").trim();
  }
}

module.exports = {
  transformHinglish,
  transformHyderabadiHindi,
  transformAnimeJapanese,
  applyDialect
};
