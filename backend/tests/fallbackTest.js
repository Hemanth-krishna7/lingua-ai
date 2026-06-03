'use strict';

const { applyDialect } = require('../src/ai/dialectTransformer');

const testCases = [
  {
    english: "Hello, how are you?",
    standardHindi: "नमस्ते, आप कैसे हैं?",
    expectedHinglish: "hey, kaise ho?",
    expectedHyderabadi: "arey, kaise ho?"
  },
  {
    english: "Thank you very much.",
    standardHindi: "बहुत-बहुत धन्यवाद।",
    expectedHinglish: "thanks yaar.",
    expectedHyderabadi: "bahut shukriya."
  },
  {
    english: "Don't worry.",
    standardHindi: "चिंता मत करो।",
    expectedHinglish: "Tension mat le.",
    expectedHyderabadi: "Tension nakko le."
  },
  {
    english: "Where are you going?",
    standardHindi: "आप कहाँ जा रहे हैं?",
    expectedHinglish: "aap kidhar ja rahe ho?",
    expectedHyderabadi: "aap kidhar jaare?"
  },
  {
    english: "What are you doing?",
    standardHindi: "आप क्या कर रहे हैं?",
    expectedHinglish: "aap kya kar rahe ho?",
    expectedHyderabadi: "aap kya karre?"
  },
  {
    english: "See you tomorrow.",
    standardHindi: "कल मिलते हैं।",
    expectedHinglish: "kal milte hain.",
    expectedHyderabadi: "kal milte."
  },
  {
    english: "Okay.",
    standardHindi: "ठीक है।",
    expectedHinglish: "theek hai.",
    expectedHyderabadi: "hau theek hai."
  },
  {
    english: "Why are you late?",
    standardHindi: "आपको देर क्यों हुई?",
    expectedHinglish: "aapko der kyun hui?",
    expectedHyderabadi: "aapko der kaiku hui?"
  }
];

console.log('=== RUNNING OFFLINE DIALECT FALLBACK TESTS ===');
let failed = 0;

testCases.forEach((tc, index) => {
  console.log(`\nTest Case ${index + 1}: "${tc.english}"`);
  console.log(`Standard Hindi Input: "${tc.standardHindi}"`);

  // Hinglish
  const hinglishOut = applyDialect(tc.standardHindi, 'Hinglish');
  const hinglishPass = hinglishOut.toLowerCase() === tc.expectedHinglish.toLowerCase();
  console.log(`  Hinglish   -> Got: "${hinglishOut}" | Expected: "${tc.expectedHinglish}" [${hinglishPass ? 'PASS' : 'FAIL'}]`);
  if (!hinglishPass) failed++;

  // Hyderabadi
  const hyderabadiOut = applyDialect(tc.standardHindi, 'Hyderabadi Hindi');
  const hyderabadiPass = hyderabadiOut.toLowerCase() === tc.expectedHyderabadi.toLowerCase();
  console.log(`  Hyderabadi -> Got: "${hyderabadiOut}" | Expected: "${tc.expectedHyderabadi}" [${hyderabadiPass ? 'PASS' : 'FAIL'}]`);
  if (!hyderabadiPass) failed++;
});

console.log('\n=============================================');
if (failed === 0) {
  console.log('ALL OFFLINE FALLBACK TESTS PASSED!');
  process.exit(0);
} else {
  console.log(`${failed} TEST(S) FAILED!`);
  process.exit(1);
}
