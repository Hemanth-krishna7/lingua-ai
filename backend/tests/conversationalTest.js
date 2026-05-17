'use strict';

// Silence internal debug logs for clean output
const origLog = console.log;
console.log = () => {};
const { applyDialect } = require('../src/ai/dialectTransformer');
console.log = origLog;

function hasDevanagari(str) {
  return /[\u0900-\u097F]/.test(str);
}

function runSuite(label, cases, dialect) {
  console.log('\n' + '═'.repeat(65));
  console.log(` ${label}`);
  console.log('═'.repeat(65));
  let pass = 0;
  cases.forEach((input, i) => {
    const output = applyDialect(input, dialect);
    const ok = !hasDevanagari(output);
    if (ok) pass++;
    const flag = ok ? '✓' : '❌ DEVANAGARI';
    const num = String(i + 1).padStart(2);
    console.log(`${num}. [${flag}]`);
    console.log(`    IN : ${input}`);
    console.log(`    OUT: ${output}`);
  });
  console.log(`\n    PASSED: ${pass}/${cases.length}`);
  return pass;
}

// ─── 25 Hinglish conversational cases ────────────────────────────────────────
// Covers: greetings, check-ins, plans, reassurance, requests,
//         farewells, gratitude, apologies, affirmations, casual chat
const hinglishCases = [
  // Greetings & check-ins
  'नमस्ते, कैसे हो?',
  'क्या हाल है यार?',
  'आज कहाँ हो?',
  'कब आ रहे हो?',
  'सब ठीक है?',

  // Plans & schedules
  'कल मिलते हैं।',
  'आज शाम को फ्री हो क्या?',
  'बाद में बात करते हैं।',
  'थोड़ा रुको, आ रहा हूँ।',
  'जल्दी करो, देर हो रही है।',

  // Reassurance
  'चिंता मत करो, मैं संभाल लूंगा।',
  'फ़िक्र मत करो, हो जाएगा।',
  'कोई बात नहीं दोस्त।',
  'सब ठीक है, रिलैक्स करो।',
  'मैं देख लूंगा।',

  // Requests & instructions
  'कृपया मुझे कॉल करें।',
  'मुझे जल्दी बताओ।',
  'भेज दो मुझे वो फोटो।',
  'देख लो एक बार।',
  'सुनो एक जरूरी बात है।',

  // Affirmations & reactions
  'हाँ यार, बिल्कुल सही।',
  'बहुत अच्छा काम किया!',
  'सच में, यह बहुत मज़ाक था।',
  'धन्यवाद दोस्त, तुमने मदद की।',
  'अलविदा, कल मिलते हैं।',
];

// ─── 25 Hyderabadi conversational cases ──────────────────────────────────────
const hyderabadiCases = [
  // Greetings & check-ins
  'क्या हो रहा है?',
  'आज क्या चल रहा है?',
  'कहाँ हो अभी?',
  'कब आओगे?',
  'सब ठीक है?',

  // Plans & schedules
  'हाँ मैं आ रहा हूँ।',
  'कहाँ जा रहे हो इतनी जल्दी?',
  'जल्दी करो, देर हो रही है।',
  'इधर आओ, बात करते हैं।',
  'थोड़ा रुको यार।',

  // Reassurance
  'चिंता मत करो, मैं संभाल लूंगा।',
  'कोई बात नहीं यार।',
  'सब ठीक है, टेंशन मत लो।',
  'मैं देख लूंगा।',
  'देख लेना, होगा सब।',

  // Questions & reactions
  'क्या कर रहे हो यहाँ?',
  'यह पागल आदमी है।',
  'पागल है क्या तुम?',
  'नहीं यार, ऐसा मत करो।',
  'हाँ भाई, समझ गया।',

  // Affirmations & farewells
  'बहुत अच्छा काम किया!',
  'सच में यह बहुत अच्छा था।',
  'बिल्कुल सही बात है।',
  'नहीं, मुझे नहीं पता।',
  'हाँ दोस्त, मैं समझ गया।',
];

const p1 = runSuite('HINGLISH — 25 CONVERSATIONAL CASES', hinglishCases, 'Hinglish');
const p2 = runSuite('HYDERABADI — 25 CONVERSATIONAL CASES', hyderabadiCases, 'Hyderabadi Hindi');

const total = hinglishCases.length + hyderabadiCases.length;
const totalPass = p1 + p2;

console.log('\n' + '═'.repeat(65));
console.log(` FINAL: ${totalPass}/${total} outputs fully Romanized`);
if (totalPass === total) {
  console.log(' ALL TESTS PASSED — Zero Devanagari in dialect outputs.');
} else {
  console.log(` ${total - totalPass} output(s) still contain Devanagari.`);
}
console.log('═'.repeat(65) + '\n');
