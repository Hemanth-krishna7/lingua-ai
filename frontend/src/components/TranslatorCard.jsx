import React, { useState, useRef, useEffect } from 'react';
import {
  ArrowRightLeft,
  Copy,
  Loader2,
  Languages,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

import toast from 'react-hot-toast';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';

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

  const sourceRef = useRef(null);
  const targetRef = useRef(null);

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

    setIsTranslating(true);

    try {
      const response = await axios.post(
        'http://localhost:5000/api/translate',
        {
          q: sourceText,
          source: sourceLang,
          target: targetLang
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

      history = history.slice(0, 10);

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
    <div className="glass-card flex flex-col w-full overflow-hidden shadow-2xl shadow-blue-500/5 rounded-3xl">

      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-200/50 dark:border-white/10 bg-white/40 dark:bg-zinc-900/40">

        {/* Source Language */}
        <div className="relative w-full sm:w-auto flex-1 max-w-[200px]">
          <select
            value={sourceLang}
            onChange={(e) => setSourceLang(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-md font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:bg-white/80 dark:hover:bg-white/10 p-3 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-blue-500/50"
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
          className="my-3 sm:my-0 p-3 rounded-full bg-white/80 dark:bg-zinc-800/80 hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 shadow-md border border-slate-200 dark:border-white/10 z-10 transition-all duration-300"
          title="Swap languages"
        >
          <ArrowRightLeft size={20} />
        </motion.button>

        {/* Target Language */}
        <div className="relative w-full sm:w-auto flex-1 max-w-[200px] flex justify-end">
          <select
            value={targetLang}
            onChange={(e) => setTargetLang(e.target.value)}
            className="w-full bg-white/50 dark:bg-black/30 backdrop-blur-md font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:bg-white/80 dark:hover:bg-white/10 p-3 rounded-xl transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-blue-500/50 text-right sm:text-left"
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
        <div className="flex-1 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200/50 dark:border-white/10 relative bg-white/30 dark:bg-transparent">

          <textarea
            ref={sourceRef}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type text to translate..."
            className="w-full bg-transparent resize-none outline-none text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 placeholder:text-slate-400/70 dark:placeholder:text-slate-500/70 min-h-[220px] leading-relaxed"
          />

          <div className="absolute bottom-6 right-6 text-sm font-medium text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-zinc-800/50 px-3 py-1 rounded-full backdrop-blur-md">
            {sourceText.length} characters
          </div>
        </div>

        {/* Target Text */}
        <div className="flex-1 p-6 md:p-8 relative bg-blue-50/30 dark:bg-blue-900/5">

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

                  <span className="text-blue-600 dark:text-blue-400 font-medium">
                    Translating magically...
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
                className="w-full bg-transparent resize-none outline-none text-xl md:text-2xl font-medium text-slate-800 dark:text-slate-100 min-h-[220px] leading-relaxed"
              />

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCopy}
                className="absolute bottom-6 right-6 p-3 rounded-xl bg-white/80 dark:bg-zinc-800/80 hover:bg-white dark:hover:bg-zinc-700 shadow-md transition-all text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-white/10 flex items-center gap-2"
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

      {/* Bottom Action */}
      <div className="p-4 bg-white/40 dark:bg-zinc-900/40 border-t border-slate-200/50 dark:border-white/10 flex justify-end">

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-400 hover:to-purple-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-3 w-full sm:w-auto justify-center transition-all duration-300"
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