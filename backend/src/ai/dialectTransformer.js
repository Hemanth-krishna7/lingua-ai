const { transliterateHindi } = require('./hindiTransliterator');

function safeReplace(text, replacements) {
  try {
    if (!text || typeof text !== "string") {
      return "";
    }
    let transformed = text;
    // Sort keys by length descending to process longest-match-first
    const sortedKeys = Object.keys(replacements).sort((a, b) => b.length - a.length);
    for (const key of sortedKeys) {
      const value = replacements[key];
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
      // ── Full-sentence / phrase patterns ─────────────────────────────────
      'चिंता मत करो, मैं संभाल लूंगा': 'Tension mat le yaar, main dekh lunga',
      'चिंता मत करो, मैं सम्भाल लूँगा': 'Tension mat le yaar, main dekh lunga',
      'मैं ऑफिस जा रहा हूँ': 'Main office ja raha hoon',
      'मैं ऑफिस जा रहा हु': 'Main office ja raha hoon',
      'कृपया मुझे कॉल करें': 'Please mujhe call karna',
      'बहुत-बहुत धन्यवाद': 'thanks yaar',
      'बहुत-बहुत धन्यवाद।': 'thanks yaar.',
      'बहुत बहुत धन्यवाद': 'thanks yaar',
      'कहाँ जा रहे हो': 'kidhar ja rahe ho',
      'कहां जा रहे हो': 'kidhar ja rahe ho',
      'कहाँ जा रहे हैं': 'kidhar ja rahe ho',
      'कहां जा रहे हैं': 'kidhar ja rahe ho',
      'क्या कर रहे हो': 'kya kar rahe ho',
      'क्या कर रहे हैं': 'kya kar rahe ho',
      'मैं संभाल लूंगा': 'main handle kar lunga',
      'मैं संभाल लूँगा': 'main handle kar lunga',
      'बाद में बात करते हैं': 'baad mein baat karte hai',
      'बाद में मिलते हैं': 'baad mein milte hai',
      'आप कैसे हैं': 'kaise ho',
      'तुम कैसे हो': 'kaise ho',
      'कैसे हो': 'kaise ho',
      'चिंता मत करो': 'Tension mat le',
      'कल मिलते हैं': 'kal milte hain',
      'फिर मिलेंगे': 'phir milte hain',
      'थोड़ा रुको': 'ek second ruk',
      'कोई बात नहीं': 'no worries',
      'फ़िक्र मत करो': 'fikar mat kar',
      'सब ठीक है': 'sab theek hai',
      'समझ गया': 'samjh gaya',
      'पता नहीं': 'pata nahi',
      'देख लेना': 'dekh lena',
      'मैं देख लूंगा': 'main dekh lunga',
      'मैं सम्भाल लूँगा': 'main dekh lunga',
      'जल्दी करो': 'jaldi kar yaar',
      'मुझे कॉल करें': 'mujhe call karna',
      'बहुत धन्यवाद': 'thanks yaar',
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
      'नमस्ते': 'hey',
      'हेलो': 'hey',
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
      'अच्छा': 'accha',
      'आपको': 'aapko',
      'तुमने': 'tumne',
      'तुम्हें': 'tumhein',
      'क्यों': 'kyun',
      'हुई': 'hui',
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
      // ── Full-sentence / phrase patterns ─────────────────────────────────
      'क्या कर रहे हो? हाँ मैं आ रहा हूँ': 'Kaiku aisa karre miya? Hau miya aa raha hoon',
      'चिंता मत करो, मैं संभाल लूंगा': 'Tension nakko le miya, main dekh leta hun miya',
      'चिंता मत करो, मैं सम्भाल लूँगा': 'Tension nakko le miya, main dekh leta hun miya',
      'और क्या कर रहे हो?': 'aur Kaiku aisa karre miya?',
      'हाँ मैं आ रहा हूँ': 'Hau miya aa raha hoon',
      'हाँ मैं आ रहा हु': 'Hau miya aa raha hoon',
      'कहाँ जा रहे हो': 'kidhar jaare',
      'कहां जा रहे हो': 'kidhar jaare',
      'कहाँ जा रहे हैं': 'kidhar jaare',
      'कहां जा रहे हैं': 'kidhar jaare',
      'क्या कर रहे हो': 'kya karre',
      'क्या कर रहे हैं': 'kya karre',
      'कल मिलते हैं': 'kal milte',
      'फिर मिलेंगे': 'phir milte',
      'आप कैसे हैं': 'kaise ho',
      'तुम कैसे हो': 'kaise ho',
      'कैसे हो': 'kaise ho',
      'चिंता मत करो': 'Tension nakko le',
      'बहुत-बहुत धन्यवाद': 'bahut shukriya',
      'बहुत-बहुत धन्यवाद।': 'bahut shukriya.',
      'बहुत धन्यवाद': 'bahut shukriya',
      'धन्यवाद': 'shukriya',
      'क्या हो रहा है': 'kya chalra miya',
      'क्या चल रहा है': 'kya chalra miya',
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
      'बहुत अच्छा': 'ek dum bhaari',
      'बहुत बढ़िया': 'ek dum bhaari',
      'बिल्कुल सही': 'ekdum sahi',
      'चिंता मत': 'tension nakko le',
      'ठीक है': 'hau theek hai',
      'हाँ यार': 'hau miya',
      'हाँ भाई': 'hau miya',
      'सच में': 'sach mein bolra',
      'मज़ाक मत करो': 'joke nakko kar',
      'क्यों नहीं': 'kaiku nai',
      'आ जाओ': 'aa potti',
      'नहीं': 'nai',
      'नही': 'nai',
      'हाँ': 'hau',
      'हां': 'hau',
      'मत': 'nakko',
      'क्यों': 'kaiku',
      'कहाँ': 'kidhar',
      'कहां': 'kidhar',
      'भाई': 'miya',
      'यार': 'miya',
      'दोस्त': 'ustad',
      'पागल': 'kirik',
      'अच्छा': 'sahi',
      'सुनो': 'sun',
      'बताओ': 'bata',
      'रुको': 'ruk',
      'आओ': 'aa',
      'नमस्ते': 'arey',
      'हेलो': 'arey',
      'आपको': 'aapko',
      'तुमने': 'tumne',
      'तुम्हें': 'tumhein',
      'हुई': 'hui',
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
    if (text === null || text === undefined) {
      return text;
    }
    if (typeof text !== 'string') {
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
