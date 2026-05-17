'use strict';

// ─── Devanagari → Roman Mapping Tables ───────────────────────────────────────

const STANDALONE_VOWELS = {
  'अ': 'a',  'आ': 'aa', 'इ': 'i',  'ई': 'ee',
  'उ': 'u',  'ऊ': 'oo', 'ए': 'e',  'ऐ': 'ai',
  'ओ': 'o',  'औ': 'au', 'ऋ': 'ri', 'ऑ': 'o',
};

const CONSONANTS = {
  // Velar
  'क': 'k',  'ख': 'kh', 'ग': 'g',  'घ': 'gh', 'ङ': 'ng',
  // Palatal
  'च': 'ch', 'छ': 'chh','ज': 'j',  'झ': 'jh', 'ञ': 'n',
  // Retroflex
  'ट': 't',  'ठ': 'th', 'ड': 'd',  'ढ': 'dh', 'ण': 'n',
  // Dental
  'त': 't',  'थ': 'th', 'द': 'd',  'ध': 'dh', 'न': 'n',
  // Labial
  'प': 'p',  'फ': 'f',  'ब': 'b',  'भ': 'bh', 'म': 'm',
  // Semi-vowels / sibilants / aspirates
  'य': 'y',  'र': 'r',  'ल': 'l',  'व': 'v',
  'श': 'sh', 'ष': 'sh', 'स': 's',  'ह': 'h',
  // Nuktated consonants (consonant + ़)
  'क़': 'q',  'ख़': 'kh', 'ग़': 'g',  'ज़': 'z',
  'ड़': 'r',  'ढ़': 'rh', 'फ़': 'f',  'य़': 'y',
};

const MATRAS = {
  'ा': 'aa', 'ि': 'i',  'ी': 'ee',
  'ु': 'u',  'ू': 'oo', 'े': 'e',
  'ै': 'ai', 'ो': 'o',  'ौ': 'au',
  'ृ': 'ri', 'ॉ': 'o',
};

const NUMERALS = {
  '०': '0', '१': '1', '२': '2', '३': '3', '४': '4',
  '५': '5', '६': '6', '७': '7', '८': '8', '९': '9',
  // Devanagari punctuation → ASCII equivalents
  '।': '.', '॥': '..', '॰': '.', '꣎': '.', '꣏': ':',
};

const VIRAMA      = '\u094D'; // ् halant — suppresses inherent 'a'
const ANUSVARA    = '\u0902'; // ं
const CHANDRABINDU= '\u0901'; // ँ
const VISARGA     = '\u0903'; // ः
const NUKTA       = '\u093C'; // ़ — turns regular consonant into nuktated form

// Sentinel: marks only Devanagari-inherent 'a' so schwa deletion never
// touches Roman replacement words like "miya", "chalra", "leta".
const INHERENT_A  = '\x01';

// ─── Main Transliteration Function ───────────────────────────────────────────

/**
 * Transliterates Devanagari script within a string to Roman script.
 * Non-Devanagari characters (ASCII, punctuation, emojis, already-Roman text)
 * are passed through completely unchanged.
 *
 * @param {string} text - Input string, possibly mixed Devanagari + Roman
 * @returns {string} - Fully Romanized string
 */
function transliterateHindi(text) {
  if (!text || typeof text !== 'string') return text || '';

  // Unicode-aware character array so multi-codepoint glyphs stay intact
  const chars = [...text];
  let result = '';
  let i = 0;

  while (i < chars.length) {
    const ch = chars[i];

    // ── Devanagari numeral ──────────────────────────────────────────────────
    if (NUMERALS[ch] !== undefined) {
      result += NUMERALS[ch];
      i++;
      continue;
    }

    // ── Standalone vowel ────────────────────────────────────────────────────
    if (STANDALONE_VOWELS[ch] !== undefined) {
      result += STANDALONE_VOWELS[ch];
      i++;
      if (i < chars.length && (chars[i] === ANUSVARA || chars[i] === CHANDRABINDU)) {
        result += 'n'; i++;
      }
      if (i < chars.length && chars[i] === VISARGA) {
        result += 'h'; i++;
      }
      continue;
    }

    // ── Consonant ───────────────────────────────────────────────────────────
    if (CONSONANTS[ch] !== undefined) {
      let romanCons = CONSONANTS[ch];

      // Peek ahead: if next char is nukta, try the nuktated mapping
      if (i + 1 < chars.length && chars[i + 1] === NUKTA) {
        const nuktated = ch + NUKTA;
        if (CONSONANTS[nuktated] !== undefined) romanCons = CONSONANTS[nuktated];
        i++; // consume nukta — it's been absorbed
      }

      result += romanCons;
      i++; // consume the consonant itself

      if (i >= chars.length) {
        result += INHERENT_A + 'a'; // inherent 'a' at string end — tagged
        continue;
      }

      const next = chars[i];

      if (next === VIRAMA) {
        // Halant: no inherent vowel — pure consonant for cluster/conjunct
        i++; // consume virama, no vowel added
      } else if (MATRAS[next] !== undefined) {
        result += MATRAS[next];
        i++; // consume matra
        // Trailing nasalisation / aspiration after matra
        if (i < chars.length && (chars[i] === ANUSVARA || chars[i] === CHANDRABINDU)) {
          result += 'n'; i++;
        }
        if (i < chars.length && chars[i] === VISARGA) {
          result += 'h'; i++;
        }
      } else if (next === ANUSVARA || next === CHANDRABINDU) {
        result += 'an';
        i++; // consume anusvara/chandrabindu
      } else if (next === VISARGA) {
        result += 'ah';
        i++; // consume visarga
      } else {
        result += INHERENT_A + 'a'; // inherent vowel — tagged for schwa deletion
      }
      continue;
    }

    // ── Lone diacritics (edge-case guard) ──────────────────────────────────
    if (ch === ANUSVARA || ch === CHANDRABINDU) { result += 'n'; i++; continue; }
    if (ch === VISARGA)  { result += 'h'; i++; continue; }
    if (ch === VIRAMA)   { i++; continue; }
    if (MATRAS[ch] !== undefined) { result += MATRAS[ch]; i++; continue; }
    if (ch === NUKTA)    { i++; continue; }

    // ── Non-Devanagari: pass through unchanged ──────────────────────────────
    // This preserves: Roman slang phrases, spaces, punctuation, emojis, numbers
    result += ch;
    i++;
  }

  // ── Sentinel-aware schwa deletion ────────────────────────────────────────
  // Only Devanagari-inherent 'a' is tagged (\x01). Roman words from the
  // replacement table pass through untagged, so "miya", "chalra", "leta"
  // are never truncated regardless of their trailing letter.
  result = result.replace(/\x01a(?=[\s,.!?;:'"\-]|$)/g, ''); // drop tagged 'a' at word edge
  result = result.replace(/\x01/g, '');                       // strip leftover sentinels

  return result;
}

module.exports = { transliterateHindi };
