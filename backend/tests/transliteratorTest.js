'use strict';

// Suppress internal debug logs from applyDialect for clean output
const origLog = console.log;
console.log = () => {};

const { transliterateHindi } = require('../src/ai/hindiTransliterator');
const { applyDialect } = require('../src/ai/dialectTransformer');

console.log = origLog; // restore

// ─── Helper ──────────────────────────────────────────────────────────────────
function hasDevanagari(str) {
  return /[\u0900-\u097F]/.test(str);
}

function runSuite(label, cases, dialect) {
  console.log('\n' + '═'.repeat(60));
  console.log(` ${label}`);
  console.log('═'.repeat(60));
  let pass = 0;
  cases.forEach((input, i) => {
    const output = applyDialect(input, dialect);
    const ok = !hasDevanagari(output);
    if (ok) pass++;
    const flag = ok ? '✓' : '❌ DEVANAGARI REMAINS';
    console.log(`${String(i + 1).padStart(2)}. IN : ${input}`);
    console.log(`    OUT: ${output}  [${flag}]`);
  });
  console.log(`\n    PASSED: ${pass}/${cases.length}`);
  return pass;
}

// ─── Transliterator unit tests ────────────────────────────────────────────────
console.log('\n' + '═'.repeat(60));
console.log(' TRANSLITERATOR UNIT CHECKS');
console.log('═'.repeat(60));

const unitCases = [
  ['मैं',          'main'],
  ['नमस्ते',       'namaste'],
  ['संभाल',        'sanbhaal'],
  ['हूँ',          'hoon'],
  ['जा रहा हूँ',  'ja raha hoon'],
  ['बहुत',         'bahut'],
  ['कल',           'kal'],
  ['खाना',         'khaana'],
  ['Tension mat le bro', 'Tension mat le bro'],  // Roman passthrough
  ['hello bro 😊',       'hello bro 😊'],         // emoji passthrough
];

let unitPass = 0;
unitCases.forEach(([input, expected]) => {
  const got = transliterateHindi(input);
  const ok = got === expected;
  if (ok) unitPass++;
  console.log(`  ${ok ? '✓' : '❌'} transliterateHindi("${input}") → "${got}"${ok ? '' : `  (expected: "${expected}")`}`);
});
console.log(`\n  PASSED: ${unitPass}/${unitCases.length}`);

// ─── Hinglish suite ───────────────────────────────────────────────────────────
const hinglishCases = [
  'नमस्ते, कैसे हो?',
  'अलविदा दोस्त',
  'चिंता मत करो, मैं संभाल लूंगा।',
  'बहुत अच्छा काम किया!',
  'सच में, यह बहुत मज़ाक था।',
  'मुझे कॉल करें जल्दी।',
  'धन्यवाद दोस्त, तुमने मदद की।',
  'क्या कर रहे हो आजकल?',
  'बिल्कुल सही बात है।',
  'माफ़ करना, मुझे देर हो गई।',
  'मैं ऑफिस जा रहा हूँ अभी।',
  'यह काम बहुत कठिन है।',
  'कृपया मुझे कॉल करें।',
  'वह बहुत अच्छा इंसान है।',
  'मेरे साथ आओ यार।',
  'कल मिलते हैं।',
  'खाना खाया क्या?',
  'बहुत थका हुआ हूँ।',
  'चलो यार, जल्दी करो।',
  'मित्र, यह तो मज़ाक था।',
];

// ─── Hyderabadi suite ─────────────────────────────────────────────────────────
const hyderabadiCases = [
  'क्या हो रहा है?',
  'चिंता मत करो, मैं संभाल लूंगा।',
  'हाँ भाई, मैं आ रहा हूँ।',
  'कहाँ जा रहे हो इतनी जल्दी?',
  'इधर आओ, बात करते हैं।',
  'यह पागल आदमी है।',
  'सच में, यह बहुत अच्छा है।',
  'नहीं, मुझे नहीं पता।',
  'हाँ मैं आ रहा हूँ।',
  'क्या कर रहे हो यहाँ?',
  'जल्दी करो, देर हो रही है।',
  'दोस्त, तुम पागल हो।',
  'मत जाओ अभी।',
  'यह क्या बात है?',
  'कहाँ गए थे तुम?',
  'हाँ, बिल्कुल सही।',
  'भाई, सुनो एक बात।',
  'नहीं चाहिए यह मुझे।',
  'हाँ दोस्त, मैं समझ गया।',
  'मत करो ऐसा।',
];

const p1 = runSuite('HINGLISH TESTS (20)', hinglishCases, 'Hinglish');
const p2 = runSuite('HYDERABADI TESTS (20)', hyderabadiCases, 'Hyderabadi Hindi');

const total = hinglishCases.length + hyderabadiCases.length;
const totalPass = p1 + p2;

console.log('\n' + '═'.repeat(60));
console.log(` FINAL SCORE: ${totalPass}/${total} dialect outputs fully Romanized`);
if (totalPass === total) {
  console.log(' ALL TESTS PASSED — No Devanagari in dialect outputs.');
} else {
  console.log(` ${total - totalPass} outputs still contain Devanagari — check above.`);
}
console.log('═'.repeat(60) + '\n');
