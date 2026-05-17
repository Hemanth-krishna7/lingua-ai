const { applyDialect } = require('../src/ai/dialectTransformer');

function runTests() {
  let passed = 0;
  let failed = 0;
  let crashes = 0;

  const testCases = [
    {
      name: 'Hinglish - Basic Replacement',
      dialect: 'hinglish',
      input: 'चिंता मत करो भाई, मैं संभाल लूंगा।',
      expectedIncluded: ['Tension mat le', 'main handle kar lunga']
    },
    {
      name: 'Hinglish - Office',
      dialect: 'hinglish',
      input: 'मैं ऑफिस जा रहा हूँ, कृपया मुझे कॉल करें',
      expectedIncluded: ['Main office ja raha hoon', 'Please mujhe call karna']
    },
    {
      name: 'Hyderabadi - Basic Replacement',
      dialect: 'hyderabadi',
      input: 'चिंता मत करो, मैं संभाल लूंगा',
      expectedIncluded: ['Tension nakko le', 'main dekh leta hun miya']
    },
    {
      name: 'Hyderabadi - Casual',
      dialect: 'hyderabadi',
      input: 'क्या कर रहे हो? हाँ मैं आ रहा हूँ',
      expectedIncluded: ['Kaiku aisa karre miya', 'Hau miya aa raha hoon']
    },
    {
      name: 'Empty String',
      dialect: 'hinglish',
      input: '',
      expected: ''
    },
    {
      name: 'Null Input',
      dialect: 'hyderabadi',
      input: null,
      expected: null
    },
    {
      name: 'Emojis and Punctuation',
      dialect: 'hinglish',
      input: 'चिंता मत करो 🚀!!!',
      expectedIncluded: ['Tension mat le 🚀!!!']
    },
    {
      name: 'Long Sentence Safety',
      dialect: 'hyderabadi',
      input: 'यह बहुत लंबी वाक्य है लेकिन चिंता मत करो, मैं संभाल लूंगा, क्योंकि तुम मेरे दोस्त हो और क्या कर रहे हो?',
      expectedIncluded: ['Tension nakko le', 'main dekh leta hun miya', 'ustad', 'Kaiku aisa karre miya']
    },
    {
      name: 'Mixed English/Hindi Input',
      dialect: 'hinglish',
      input: 'Please चिंता मत करो, everything is fine.',
      expectedIncluded: ['Please Tension mat le, everything is fine.']
    }
  ];

  console.log('--- RUNNING HINDI DIALECT TEST SUITE ---');

  for (const tc of testCases) {
    try {
      const output = applyDialect(tc.input, tc.dialect);
      
      let isPass = true;
      if (tc.expected !== undefined) {
        if (output !== tc.expected) isPass = false;
      } else if (tc.expectedIncluded) {
        for (const exp of tc.expectedIncluded) {
          if (output && !output.includes(exp)) {
            isPass = false;
            console.error(`[FAIL] ${tc.name}\n  Missing: ${exp}\n  Got: ${output}`);
          }
        }
      }
      
      if (isPass) {
        passed++;
        console.log(`[PASS] ${tc.name}`);
      } else {
        failed++;
      }
    } catch (e) {
      crashes++;
      console.error(`[CRASH] ${tc.name} - Exception thrown!`, e);
    }
  }

  console.log('----------------------------------------');
  console.log(`Total: ${testCases.length} | Passed: ${passed} | Failed: ${failed} | Crashes: ${crashes}`);
  
  if (crashes > 0 || failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
