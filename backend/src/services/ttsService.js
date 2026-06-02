const axios = require('axios');
const crypto = require('crypto');

const FEMALE_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // Bella
const MALE_VOICE_ID = 'ErXwobaYiN019PkySvjV';   // Antoni
const ttsCache = new Map(); // In-memory cache

/**
 * Returns the stable ElevenLabs Voice ID by speaker profile gender.
 */
function getVoiceIdBySpeakerProfile(profile) {
  const normalized = (profile || 'Female').toLowerCase();
  if (normalized === 'male') {
    return MALE_VOICE_ID;
  }
  return FEMALE_VOICE_ID;
}

/**
 * Maps frontend tones to specific ElevenLabs voice settings parameters for realistic delivery styles.
 */
function getVoiceSettingsByTone(tone) {
  const normalizedTone = (tone || 'Standard').toLowerCase();

  switch (normalizedTone) {
    case 'professional':
      return {
        stability: 0.85,
        similarity_boost: 0.75,
        style: 0.05,
        use_speaker_boost: true
      };
    case 'casual':
      return {
        stability: 0.65,
        similarity_boost: 0.8,
        style: 0.2,
        use_speaker_boost: true
      };
    case 'friendly':
      return {
        stability: 0.55,
        similarity_boost: 0.85,
        style: 0.35,
        use_speaker_boost: true
      };
    case 'emotional':
      return {
        stability: 0.45,
        similarity_boost: 0.85,
        style: 0.5,
        use_speaker_boost: true
      };
    default:
      return {
        stability: 0.75,
        similarity_boost: 0.75,
        style: 0.1,
        use_speaker_boost: true
      };
  }
}

/**
 * Generates a SHA-256 hash key for caching based on language, dialect, tone, speakerProfile, and text.
 */
function getCacheKey(language, dialect, tone, speakerProfile, text) {
  const normalized = `${language || ''}:${dialect || ''}:${tone || 'Standard'}:${speakerProfile || 'Female'}:${text || ''}`.trim();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

/**
 * Calls the ElevenLabs API with retry protection and AbortController timeouts.
 */
async function callElevenLabs(text, apiKey, voiceId, voiceSettings, attempt = 1) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => {
    controller.abort();
  }, 8000); // Strict 8-second timeout limit

  try {
    const response = await axios({
      method: 'POST',
      url: `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      data: {
        text: text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: voiceSettings
      },
      responseType: 'arraybuffer',
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    console.log('[TTS API RESPONSE] ElevenLabs returned status:', response.status);
    console.log('[TTS STATUS] Success on attempt', attempt);
    return response.data;
  } catch (error) {
    clearTimeout(timeoutId);

    const isAbort = error.name === 'AbortError' || error.code === 'ECONNABORTED';
    const errorMessage = isAbort ? 'Request Timeout (8000ms exceeded)' : error.message;
    const errorStatus = error.response ? error.response.status : 'N/A';

    console.error(`[TTS ERROR] Attempt ${attempt} failed: ${errorMessage}`);
    console.log('[TTS STATUS] Failed with status code:', errorStatus);

    if (error.response) {
      try {
        console.log(
          '[ELEVENLABS RESPONSE]',
          Buffer.from(error.response.data).toString('utf8')
        );
      } catch (e) {
        console.log(
          '[ELEVENLABS RESPONSE]',
          error.response.data
        );
      }
    }

    // If it failed and we haven't retried yet, perform a single retry (excluding deliberate Aborts)
    if (attempt === 1 && !isAbort) {
      console.log('[TTS RETRY] Performing single retry for ElevenLabs...');
      return callElevenLabs(text, apiKey, voiceId, voiceSettings, attempt + 1);
    }

    throw new Error(errorMessage);
  }
}

/**
 * Primary service function to retrieve high-quality speech buffer.
 */
async function generateSpeech({ text, dialect, language, tone, speakerProfile }) {
  console.log('[TTS REQUEST START]', { text, dialect, language });

  const activeSpeakerProfile = speakerProfile || 'Female';
  const voiceId = getVoiceIdBySpeakerProfile(activeSpeakerProfile);
  console.log('[TTS SPEAKER PROFILE]', activeSpeakerProfile);
  console.log('[TTS VOICE ID]', voiceId);

  const activeTone = tone || 'Standard';
  console.log('[TTS TONE]', activeTone);

  const voiceSettings = getVoiceSettingsByTone(activeTone);
  console.log('[TTS VOICE SETTINGS]', voiceSettings);

  const apiKey = process.env.ELEVENLABS_API_KEY;

  console.log(
    '[ELEVENLABS KEY]',
    apiKey ? apiKey.substring(0, 8) + '...' : 'MISSING'
  );

  if (!apiKey) {
    const errorMsg = 'ELEVENLABS_API_KEY is not defined in environment';
    console.error('[TTS FAILURE] API Key missing');
    throw new Error(errorMsg);
  }

  const cacheKey = getCacheKey(language, dialect, activeTone, activeSpeakerProfile, text);

  if (ttsCache.has(cacheKey)) {
    console.log('[TTS CACHE HIT]');
    console.log('[TTS STATUS] Cache hit - serving from memory');
    console.log('[TTS SUCCESS] Served from cache');
    return ttsCache.get(cacheKey);
  }

  try {
    const audioBuffer = await callElevenLabs(text, apiKey, voiceId, voiceSettings);

    // Store in-memory cache
    ttsCache.set(cacheKey, audioBuffer);

    console.log('[TTS SUCCESS] Audio generated successfully. Buffer size:', audioBuffer.byteLength);
    return audioBuffer;
  } catch (error) {
    console.error('[TTS FAILURE] ElevenLabs generation failed:', error.message);
    throw error;
  }
}

module.exports = {
  generateSpeech
};
