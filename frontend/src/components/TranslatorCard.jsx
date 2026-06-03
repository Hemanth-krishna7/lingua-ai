import { useState, useRef, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Loader2,
  Languages,
  CheckCircle2,
  Sparkles,
  Mic,
  Volume2,
  Square,
  X,
  Gauge
} from 'lucide-react';

import toast from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import CommunicationModes from './CommunicationModes';

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'te', name: 'Telugu' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' },
  { code: 'ja', name: 'Japanese' }
];

const TranslatorCard = () => {
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('hi');
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const [tone, setTone] = useState('Standard');
  const [dialect, setDialect] = useState('Standard');
  const [speakerProfile, setSpeakerProfile] = useState('Female');
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  const [processingStep, setProcessingStep] = useState(0);

  const isSmart = dialect !== 'Standard' || tone !== 'Standard';
  const PROCESSING_MESSAGES = [
    "Crafting natural conversation...",
    "Applying local dialect...",
    "Refining human-like phrasing..."
  ];

  useEffect(() => {
    let interval;
    if (isTranslating && isSmart) {
      setProcessingStep(0);
      interval = setInterval(() => {
        setProcessingStep(prev => (prev + 1) % 3);
      }, 1500);
    }
    return () => clearInterval(interval);
  }, [isTranslating, isSmart]);

  // Voice States
  const [isListening, setIsListening] = useState(false);
  const [speechState, setSpeechState] = useState('idle'); // 'idle' | 'generating' | 'playing' | 'paused' | 'error'
  const [speechSupported, setSpeechSupported] = useState(true);
  const [synthSupported, setSynthSupported] = useState(true);
  const [voices, setVoices] = useState([]);

  const sourceRef = useRef(null);
  const targetRef = useRef(null);
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);
  const speechStateRef = useRef('idle');
  const selectedVoiceNameRef = useRef('Default');

  const getSpeechLangCode = (lang) => {
    if (lang === 'hi') return 'hi-IN';
    if (lang === 'en') return 'en-US';
    return lang;
  };

  const isDialectAudioDisabled = dialect === 'Hinglish' || dialect === 'Hyderabadi Hindi' || dialect === 'Anime Casual';

  const hasNativeVoice = (() => {
    if (!synthSupported || voices.length === 0) return false;
    const utteranceLang = getSpeechLangCode(targetLang);
    return !!findVoice(utteranceLang);
  })();

  const isAudioSupported = synthSupported && !isDialectAudioDisabled && hasNativeVoice;

  // Development diagnostics logger
  useEffect(() => {
    if (import.meta.env.DEV) {
      const langCode = getSpeechLangCode(targetLang);
      const voice = findVoice(langCode);
      
      let reason = 'Native voice available';
      if (isDialectAudioDisabled) {
        reason = 'Dialect mode restricted';
      } else if (!voice) {
        reason = 'No native voice found';
      }

      if (import.meta.env.DEV) {
        console.log(`[DEV MODE - SPEECH DIAGNOSTICS]
Target Language: ${targetLang}
Dialect: ${dialect}
Voice Name: ${voice ? voice.name : 'None'}
Voice Lang: ${voice ? voice.lang : 'None'}
Audio Enabled: ${isAudioSupported}
Reason: ${reason}`);
      }
    }
  }, [targetLang, dialect, voices, speakerProfile]);

  useEffect(() => {
    speechStateRef.current = speechState;
  }, [speechState]);

  useEffect(() => {
    const updateVoices = () => {
      if (window.speechSynthesis) {
        setVoices(window.speechSynthesis.getVoices());
      }
    };
    updateVoices();
    if (window.speechSynthesis) {
      window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
    }
    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.removeEventListener('voiceschanged', updateVoices);
      }
    };
  }, []);

  useEffect(() => {
    const handlePopulateSourceText = (e) => {
      if (e.detail && e.detail.text !== undefined) {
        setSourceText(e.detail.text);
        if (sourceRef.current) {
          sourceRef.current.focus();
        }
      }
    };
    window.addEventListener('populateSourceText', handlePopulateSourceText);
    return () => {
      window.removeEventListener('populateSourceText', handlePopulateSourceText);
    };
  }, []);

  useEffect(() => {
    // Check Speech Recognition Support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        // Append final transcript or show interim
        setSourceText((prev) => {
          const currentText = prev.replace(/\s?\*.*?\*$/, ''); // remove previous interim
          if (finalTranscript) {
            return currentText + (currentText ? ' ' : '') + finalTranscript;
          }
          if (interimTranscript) {
            return currentText + (currentText ? ' ' : '') + `*${interimTranscript}*`;
          }
          return prev;
        });
      };

      recognitionRef.current.onerror = (event) => {
        if (event.error === 'not-allowed') {
          toast.error('Microphone access denied.');
          setIsListening(false);
        } else if (event.error !== 'no-speech') {
          toast.error(`Speech recognition error: ${event.error}`);
          setIsListening(false);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        // Clean up any interim markers if abruptly stopped
        setSourceText(prev => prev.replace(/\s?\*.*?\*$/, ''));
      };
    } else {
      setSpeechSupported(false);
    }

    // Check Speech Synthesis Support
    if (!window.speechSynthesis) {
      setSynthSupported(false);
    }

    return () => {
      if (recognitionRef.current) recognitionRef.current.stop();
      if (speechStateRef.current !== 'idle') {
        if (import.meta.env.DEV) {
          console.log('[SPEECH STOP]');
        }
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const adjustTextareaHeight = (element) => {
    if (element) {
      element.style.height = 'auto';
      element.style.height = `${element.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight(sourceRef.current);
  }, [sourceText]);

  useEffect(() => {
    adjustTextareaHeight(targetRef.current);
  }, [translatedText]);

  // Stop speech if text, dialect, target language, or speaker profile changes
  useEffect(() => {
    changeSpeechState('idle');
    setSpeechState('idle');

    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, [translatedText, dialect, targetLang, speakerProfile]);

  function changeSpeechState(newState) {
    const oldState = speechStateRef.current;
    if (oldState === newState) return;

    speechStateRef.current = newState;
    setSpeechState(newState);

    if (newState === 'playing') {
      if (import.meta.env.DEV) {
        console.log('[SPEECH START]');
        console.log('[SPEECH VOICE]', selectedVoiceNameRef.current);
        console.log('[SPEECH TEXT]', translatedText);
      }
    } else if (newState === 'paused' || newState === 'idle') {
      if (oldState === 'playing' || oldState === 'paused') {
        if (import.meta.env.DEV) {
          console.log('[SPEECH STOP]');
        }
      }
    }
  }

  function findVoice(langCode) {
    // Get all voices matching the language code or prefix
    const exactLang = langCode.replace('-', '_');
    const targetPrefix = langCode.toLowerCase().split('-')[0].split('_')[0];

    // Filter voices matching the language
    const langVoices = voices.filter(v => 
      v.lang === langCode || 
      v.lang === exactLang ||
      v.lang.toLowerCase().replace('_', '-').startsWith(targetPrefix)
    );

    // If no voice matches the language prefix, return null immediately
    if (langVoices.length === 0) {
      return null;
    }

    const isFemale = speakerProfile === 'Female';
    const isMale = speakerProfile === 'Male';

    const femaleKeywords = [
      'female', 'zira', 'hazel', 'susan', 'heera', 'samantha', 'victoria', 'karen', 'moira', 
      'tessa', 'veena', 'fiona', 'haruka', 'nanami', 'kyoko', 'mizuki', 'salli', 'kimberly', 
      'kendra', 'joanna', 'ivy', 'nicole', 'mei-jia', 'sin-ji', 'ting-ting', 'yaoyao', 'elsa'
    ];

    const maleKeywords = [
      'male', 'david', 'george', 'ravi', 'mark', 'daniel', 'alex', 'fred', 'henrik', 'ichiro', 
      'keita', 'joey', 'justin', 'matthew', 'russell', 'kangkang', 'zhiyu'
    ];

    const genderKeywords = isFemale ? femaleKeywords : (isMale ? maleKeywords : []);

    const matchedVoices = langVoices.filter(v => {
      const nameLower = v.name.toLowerCase();
      return genderKeywords.some(kw => {
        if (kw === 'male') {
          return nameLower.includes('male') && !nameLower.includes('female');
        }
        return nameLower.includes(kw);
      });
    });

    let selectedVoice = null;

    // Priority 1: Remote voice matching language + gender
    if (genderKeywords.length > 0) {
      selectedVoice = matchedVoices.find(v => !v.localService);
    }

    // Priority 2: Local voice matching language + gender
    if (!selectedVoice && genderKeywords.length > 0) {
      selectedVoice = matchedVoices.find(v => v.localService);
    }

    // Priority 3: Any remote voice matching language
    if (!selectedVoice) {
      selectedVoice = langVoices.find(v => !v.localService);
    }

    // Priority 4: Any local voice matching language
    if (!selectedVoice) {
      selectedVoice = langVoices.find(v => v.localService);
    }

    // Priority 5: Null (returning selectedVoice which is null if none matched)
    return selectedVoice;
  }

  // Voice Handlers
  const toggleListening = () => {
    if (!speechSupported) {
      toast.error('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.lang = sourceLang === 'en' ? 'en-US' : sourceLang;
      try {
        recognitionRef.current.start();
        setIsListening(true);
        toast.success('Listening...', { icon: '🎙️' });
      } catch (err) {
        console.error('Failed to start recognition', err);
      }
    }
  };

  const handleSpeak = () => {
    if (!synthSupported) {
      toast.error('Text-to-speech is not supported in this browser.');
      return;
    }

    if (!isAudioSupported) {
      if (isDialectAudioDisabled) {
        toast.error('Audio playback is available only for standard languages.');
      } else {
        toast.error('Audio unavailable on this device.');
      }
      return;
    }

    if (!translatedText) return;

    // 1. If currently playing, toggle to pause
    if (speechState === 'playing') {
      window.speechSynthesis.pause();
      changeSpeechState('paused');
      return;
    }

    // 2. If currently paused, toggle to play (resume)
    if (speechState === 'paused') {
      window.speechSynthesis.resume();
      changeSpeechState('playing');
      return;
    }

    // 3. Start fresh speech generation (Web Speech API is instantaneous)
    window.speechSynthesis.cancel();

    const utteranceLang = getSpeechLangCode(targetLang);

    const utterance = new SpeechSynthesisUtterance(translatedText);
    utteranceRef.current = utterance; // Keep ref to prevent GC

    const selectedVoice = findVoice(utteranceLang);
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      selectedVoiceNameRef.current = selectedVoice.name;
    } else {
      selectedVoiceNameRef.current = 'Default';
    }

    utterance.lang = utteranceLang;
    utterance.rate = playbackSpeed;

    utterance.onstart = () => {
      changeSpeechState('playing');
    };

    utterance.onend = () => {
      changeSpeechState('idle');
    };

    utterance.onerror = (event) => {
      if (event.error !== 'interrupted') {
        changeSpeechState('idle');
      }
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleSwap = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  const handleCopy = () => {
    if (!translatedText) return;

    navigator.clipboard.writeText(translatedText);

    setIsCopied(true);

    toast.success('Copied to clipboard!');

    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    if (import.meta.env.DEV) {
      console.log('[FRONTEND SUBMIT]', { q: sourceText, source: sourceLang, target: targetLang, tone, dialect });
    }
    setIsTranslating(true);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/translate`,
        {
          q: sourceText,
          source: sourceLang,
          target: targetLang,
          tone,
          dialect
        }
      );

      const resultText = response.data.translatedText;
      setTranslatedText(resultText);


      const historyItem = {
        sourceLang:
          LANGUAGES.find((l) => l.code === sourceLang)?.name,
        targetLang:
          LANGUAGES.find((l) => l.code === targetLang)?.name,
        sourceText,
        translatedText: resultText,
        timestamp: new Date().getTime()
      };

      const saved = localStorage.getItem('translation_history');

      let history = saved ? JSON.parse(saved) : [];

      history.unshift(historyItem);

      history = history.slice(0, 25);

      localStorage.setItem(
        'translation_history',
        JSON.stringify(history)
      );

      window.dispatchEvent(new Event('translationAdded'));

    } catch (error) {

      console.error('Translation failed', error);

      toast.error('Translation failed. Please try again.');

    } finally {

      setIsTranslating(false);
    }
  };

  return (
    <div className="glass-card flex flex-col w-full overflow-hidden shadow-2xl shadow-blue-500/5 rounded-2xl sm:rounded-3xl border-0 sm:border border-slate-200/50 dark:border-white/10">



      {/* Top Controls */}
      <div className="flex flex-row items-center justify-between p-2 sm:p-4 border-b border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40 w-full gap-1 sm:gap-2">

        {/* Source Language */}
        <div className="relative flex-1 min-w-0 max-w-[200px]">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-md font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:bg-white/80 dark:hover:bg-white/10 p-2.5 sm:p-3 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-blue-500/50 text-base text-center sm:text-left text-ellipsis overflow-hidden whitespace-nowrap"
            aria-label="Select Source Language"
          >
            {LANGUAGES.map((lang) => (
              <option
                key={`src-${lang.code}`}
                value={lang.code}
                className="dark:bg-zinc-900"
              >
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <motion.button
          whileHover={{ scale: 1.1, rotate: 180 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSwap}
          className="mx-1 sm:mx-2 p-2 sm:p-3 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-md border border-slate-200 dark:border-white/10 z-10 transition-all duration-300 shrink-0"
          title="Swap languages"
          aria-label="Swap languages"
        >
          <ArrowRightLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </motion.button>

        {/* Target Language */}
        <div className="relative flex-1 min-w-0 max-w-[200px] flex justify-end">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-md font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:bg-white/80 dark:hover:bg-white/10 p-2.5 sm:p-3 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-blue-500/50 text-center sm:text-left text-base text-ellipsis overflow-hidden whitespace-nowrap"
            aria-label="Select Target Language"
          >
            {LANGUAGES.map((lang) => (
              <option
                key={`tgt-${lang.code}`}
                value={lang.code}
                className="dark:bg-zinc-900"
              >
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Translation Area */}
      <div className="flex flex-col md:flex-row relative min-h-[320px]">

        {/* Source Text */}
        <div className="flex-1 p-5 md:p-8 border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-white/10 relative bg-white/30 dark:bg-transparent group">

          <textarea
            ref={sourceRef}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type text to translate..."
            className="w-full bg-transparent resize-none outline-none text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400/70 dark:placeholder:text-slate-500/70 min-h-[200px] md:min-h-[220px] leading-relaxed pb-16"
            aria-label="Source text to translate"
          />

          {sourceText && (
            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              onClick={() => setSourceText('')}
              className="absolute top-5 right-5 md:top-6 md:right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              title="Clear text"
              aria-label="Clear text"
            >
              <X size={18} />
            </motion.button>
          )}

          {/* Source Text Controls */}
          <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex items-center gap-3">
            {speechSupported && (
              <div className="relative">
                {isListening && (
                  <motion.div
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0.1, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                    className="absolute inset-0 bg-red-500 rounded-xl blur-md"
                  />
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={toggleListening}
                  className={`relative p-3 rounded-xl shadow-md transition-all border flex items-center justify-center ${isListening
                    ? 'bg-red-500 text-white border-red-600 hover:bg-red-600'
                    : 'bg-white/80 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-700'
                    }`}
                  title={isListening ? 'Stop listening' : 'Start speaking'}
                  aria-label={isListening ? 'Stop listening' : 'Start speaking'}
                >
                  {isListening ? <Square size={20} className="fill-current" /> : <Mic size={20} />}
                </motion.button>
              </div>
            )}

            <AnimatePresence>
              {isListening && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="text-sm font-medium text-red-500 flex items-center gap-2"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  Listening...
                </motion.span>
              )}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-5 right-5 md:bottom-6 md:right-6 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full backdrop-blur-md transition-opacity duration-300">
            {sourceText.length} characters
          </div>
        </div>

        {/* Target Text */}
        <div className="flex-1 p-5 md:p-8 relative bg-blue-50/30 dark:bg-blue-900/5">

          <AnimatePresence>
            {isTranslating && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-zinc-950/60 backdrop-blur-md z-10"
              >
                <div className="flex flex-col items-center gap-4">
                  <Loader2
                    className="animate-spin text-blue-500"
                    size={40}
                  />

                  <span className="text-blue-600 dark:text-blue-400 font-medium text-center max-w-[200px]">
                    <AnimatePresence mode="wait">
                      <motion.span
                        key={isSmart ? processingStep : 'standard'}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        transition={{ duration: 0.3 }}
                        className="block"
                      >
                        {isSmart ? PROCESSING_MESSAGES[processingStep] : "Translating magically..."}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {translatedText ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col"
            >

              <textarea
                ref={targetRef}
                value={translatedText}
                readOnly
                className="w-full bg-transparent resize-none outline-none text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 min-h-[200px] md:min-h-[220px] leading-relaxed pb-16"
                aria-label="Translated text"
              />

              {/* Target Text Controls */}
              <div className="absolute bottom-5 left-5 md:bottom-6 md:left-6 flex items-center gap-3">
                {synthSupported && (
                  <>
                    <div className="relative">
                      {speechState === 'playing' && (
                        <motion.div
                          animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 bg-blue-500 rounded-full blur-md"
                        />
                      )}
                      <motion.button
                        whileHover={isAudioSupported ? { scale: 1.05 } : {}}
                        whileTap={isAudioSupported ? { scale: 0.95 } : {}}
                        disabled={!isAudioSupported}
                        onClick={handleSpeak}
                        className={`relative p-3 rounded-xl shadow-md transition-all border flex items-center justify-center ${
                          !isAudioSupported
                            ? 'bg-slate-100 dark:bg-zinc-800/40 text-slate-400 dark:text-slate-600 border-slate-200/30 dark:border-white/5 cursor-not-allowed'
                            : speechState === 'playing' || speechState === 'generating'
                            ? 'bg-blue-500 text-white border-blue-600 hover:bg-blue-600'
                            : 'bg-white/80 dark:bg-zinc-800/80 text-slate-600 dark:text-slate-300 border-slate-200/50 dark:border-white/10 hover:bg-white dark:hover:bg-zinc-700'
                        }`}
                        title={
                          !isAudioSupported
                            ? isDialectAudioDisabled
                              ? 'Audio playback is available only for standard languages.'
                              : 'Audio unavailable on this device.'
                            : speechState === 'playing'
                            ? 'Stop speaking'
                            : speechState === 'generating'
                            ? 'Cancel speech'
                            : 'Speak translation'
                        }
                        aria-label={
                          !isAudioSupported
                            ? isDialectAudioDisabled
                              ? 'Audio playback is available only for standard languages.'
                              : 'Audio unavailable on this device.'
                            : speechState === 'playing'
                            ? 'Stop speaking'
                            : speechState === 'generating'
                            ? 'Cancel speech'
                            : 'Speak translation'
                        }
                      >
                        {speechState === 'generating' ? (
                          <Loader2 size={20} className="animate-spin" />
                        ) : speechState === 'playing' ? (
                          <Square size={20} className="fill-current" />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </motion.button>
                    </div>

                    <AnimatePresence>
                      {speechState === 'generating' && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-xs font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 ml-1 shrink-0 select-none"
                        >
                          <Loader2 size={12} className="animate-spin" />
                          Preparing speech...
                        </motion.span>
                      )}
                    </AnimatePresence>

                    {isAudioSupported && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setPlaybackSpeed(prev => prev === 1 ? 0.75 : prev === 0.75 ? 0.5 : 1)}
                        className="p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-all text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10 flex items-center justify-center gap-1 font-medium text-xs"
                        title={`Playback speed: ${playbackSpeed}x`}
                        aria-label="Toggle playback speed"
                      >
                        <Gauge size={16} />
                        <span className="w-6">{playbackSpeed}x</span>
                      </motion.button>
                    )}
                  </>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="absolute bottom-5 right-5 md:bottom-6 md:right-6 p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-all text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10 flex items-center gap-2"
                title="Copy translation"
                aria-label="Copy translation"
              >
                {isCopied ? (
                  <CheckCircle2
                    size={20}
                    className="text-green-500"
                  />
                ) : (
                  <Copy size={20} />
                )}

                <span className="text-sm font-medium hidden sm:block">
                  {isCopied ? 'Copied' : 'Copy'}
                </span>
              </motion.button>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 dark:text-slate-600 opacity-60">

              <motion.div
                initial={{ opacity: 0.5, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: 'reverse'
                }}
              >
                <Languages
                  size={64}
                  className="mb-6 opacity-50"
                  strokeWidth={1}
                />
              </motion.div>

              <p className="text-lg font-medium">
                Translation will appear here
              </p>
            </div>
          )}
        </div>
      </div>

      <CommunicationModes
        tone={tone} setTone={setTone}
        dialect={dialect} setDialect={setDialect}
        speakerProfile={speakerProfile} setSpeakerProfile={setSpeakerProfile}
      />

      {/* Bottom Action */}
      <div className="p-4 bg-white/40 dark:bg-zinc-900/40 border-t border-slate-200/50 dark:border-white/10 flex justify-end">

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim() || isListening}
          className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-4 px-6 md:py-3.5 md:px-8 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 w-full sm:w-auto justify-center transition-all duration-300 text-base md:text-lg"
          aria-label="Translate text"
        >
          {isTranslating ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Translate Text</span>
              <Sparkles
                size={18}
                className="opacity-70"
              />
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
};

export default TranslatorCard;