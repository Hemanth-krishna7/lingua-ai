'use strict';

const origLog = console.log;
console.log = () => {};
const { transliterateHindi } = require('../src/ai/hindiTransliterator');
const { applyDialect } = require('../src/ai/dialectTransformer');
console.log = origLog;

function hasDevanagari(s) { return /[\u0900-\u097F]/.test(s); }
function hasBadForm(s) {
  // Detect specific compressed forms the user flagged
  return /\bmiy\b/.test(s) || /\bchalr\b/.test(s) || /\blet\b(?!\w)/.test(s);
}

// ── Unit: verify sentinel fix preserves Roman words ──────────────────────────
console.log('\n' + '═'.repeat(62));
console.log(' UNIT: Sentinel schwa deletion — Roman words must survive');
console.log('═'.repeat(62));

const unitCases = [
  // Roman pass-through must be untouched
  { input: 'Tension nakko le miya',    mustContain: 'miya'   },
  { input: 'kya chalra miya',          mustContain: 'chalra' },
  { input: 'main dekh leta hun miya',  mustContain: 'leta'   },
  { input: 'hau miya, aa raha hoon',   mustContain: 'miya'   },
  { input: 'idhar aa potti',           mustContain: 'potti'  },
  // Devanagari inherent-'a' must still be dropped at word ends
  { input: 'मत',   mustContain: 'mat'  },
  { input: 'यह',   mustContain: 'yah'  },
];

let uPass = 0;
unitCases.forEach(({ input, mustContain }) => {
  const out = transliterateHindi(input);
  const ok = out.includes(mustContain) && !hasDevanagari(out);
  if (ok) uPass++;
  console.log(`  ${ok ? '✓' : '❌'} transliterate("${input}") → "${out}" [must have: "${mustContain}"]`);
});
console.log(`\n  UNIT PASSED: ${uPass}/${unitCases.length}\n`);

// ── 30 realism-focused dialect cases ─────────────────────────────────────────
const hinglishCases = [
  // Compressed-form regression
  'चिंता मत करो, मैं संभाल लूंगा।',
  'मैं देख लूंगा।',
  'सब ठीक है।',
  'कोई बात नहीं।',
  'समझ गया।',
  // Natural chat flows
  'नमस्ते, कैसे हो?',
  'हाँ यार, बिल्कुल सही।',
  'धन्यवाद दोस्त।',
  'माफ़ करना यार।',
  'अलविदा, कल मिलते हैं।',
  'जल्दी करो, देर हो रही है।',
  'भेज दो मुझे वो फ़ाइल।',
  'देख लो एक बार।',
  'थोड़ा रुको, आ रहा हूँ।',
  'बाद में बात करते हैं।',
];

const hyderabadiCases = [
  // Compressed-form regression
  'क्या हो रहा है?',
  'चिंता मत करो, मैं संभाल लूंगा।',
  'मैं देख लूंगा।',
  'हाँ मैं आ रहा हूँ।',
  'कोई बात नहीं यार।',
  // Natural chat flows
  'थोड़ा रुको यार।',
  'नहीं यार, ऐसा मत करो।',
  'हाँ भाई, समझ गया।',
  'पागल है क्या तुम?',
  'बहुत अच्छा काम किया!',
  'सब ठीक है, टेंशन मत लो।',
  'कहाँ जा रहे हो इतनी जल्दी?',
  'यह पागल आदमी है।',
  'बिल्कुल सही बात है।',
  'हाँ दोस्त, मैं समझ गया।',
];

function runSuite(label, cases, dialect) {
  console.log('═'.repeat(62));
  console.log(` ${label}`);
  console.log('═'.repeat(62));
  let pass = 0;
  cases.forEach((input, i) => {
    const output = applyDialect(input, dialect);
    const devOk  = !hasDevanagari(output);
    const formOk = !hasBadForm(output);
    const ok = devOk && formOk;
    if (ok) pass++;
    const flag = ok ? '✓' : `❌${!devOk ? ' DEVA' : ''}${!formOk ? ' COMPRESSED' : ''}`;
    console.log(`${String(i+1).padStart(2)}. [${flag}]`);
    console.log(`    IN : ${input}`);
    console.log(`    OUT: ${output}`);
  });
  console.log(`\n    PASSED: ${pass}/${cases.length}\n`);
  return pass;
}

const p1 = runSuite('HINGLISH  — 15 REALISM CASES', hinglishCases, 'Hinglish');
const p2 = runSuite('HYDERABADI — 15 REALISM CASES', hyderabadiCases, 'Hyderabadi Hindi');

const total = hinglishCases.length + hyderabadiCases.length;
const totalPass = p1 + p2;
console.log('═'.repeat(62));
console.log(` FINAL: ${totalPass}/${total} — ${totalPass === total ? 'ALL PASSED' : `${total-totalPass} FAILED`}`);
console.log('═'.repeat(62) + '\n');
