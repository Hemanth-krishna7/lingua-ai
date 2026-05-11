import React, { useState, useRef, useEffect } from 'react';
import { ArrowRightLeft, Copy, Loader2, Languages } from 'lucide-react';
import toast from 'react-hot-toast';
import axios from 'axios';

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
    toast.success('Copied to clipboard!');
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      toast.error('Please enter text to translate');
      return;
    }

    setIsTranslating(true);
    try {
      // Connect to backend
      const response = await axios.post('http://localhost:5000/api/translate', {
        q: sourceText,
        source: sourceLang,
        target: targetLang
      });

      const resultText = response.data.translatedText;
      setTranslatedText(resultText);

      // Save to local storage
      const historyItem = {
        sourceLang: LANGUAGES.find(l => l.code === sourceLang)?.name,
        targetLang: LANGUAGES.find(l => l.code === targetLang)?.name,
        sourceText,
        translatedText: resultText,
        timestamp: new Date().getTime()
      };
      
      const saved = localStorage.getItem('translation_history');
      let history = saved ? JSON.parse(saved) : [];
      history.unshift(historyItem);
      // Keep only last 10
      history = history.slice(0, 10);
      localStorage.setItem('translation_history', JSON.stringify(history));
      
      // Notify History Component
      window.dispatchEvent(new Event('translationAdded'));
      
    } catch (error) {
      console.error('Translation failed', error);
      toast.error('Translation failed. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="glass-card flex flex-col w-full overflow-hidden">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/30">
        <select 
          value={sourceLang}
          onChange={(e) => setSourceLang(e.target.value)}
          className="w-full sm:w-auto bg-transparent font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors appearance-none"
        >
          {LANGUAGES.map(lang => (
            <option key={`src-${lang.code}`} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
          ))}
        </select>

        <button 
          onClick={handleSwap}
          className="my-2 sm:my-0 p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-600 dark:text-slate-300 shadow-sm border border-slate-200 dark:border-slate-600"
          title="Swap languages"
        >
          <ArrowRightLeft size={18} />
        </button>

        <select 
          value={targetLang}
          onChange={(e) => setTargetLang(e.target.value)}
          className="w-full sm:w-auto bg-transparent font-medium text-slate-800 dark:text-slate-100 outline-none cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 p-2 rounded-lg transition-colors appearance-none"
        >
          {LANGUAGES.map(lang => (
            <option key={`tgt-${lang.code}`} value={lang.code} className="dark:bg-slate-800">{lang.name}</option>
          ))}
        </select>
      </div>

      {/* Text Areas */}
      <div className="flex flex-col md:flex-row relative">
        {/* Source */}
        <div className="flex-1 p-6 border-b md:border-b-0 md:border-r border-slate-200 dark:border-slate-700/50 relative group">
          <textarea
            ref={sourceRef}
            value={sourceText}
            onChange={(e) => setSourceText(e.target.value)}
            placeholder="Type text to translate..."
            className="w-full bg-transparent resize-none outline-none text-lg text-slate-800 dark:text-slate-100 placeholder:text-slate-400 min-h-[150px]"
          />
          <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400">
            {sourceText.length} characters
          </div>
        </div>

        {/* Target */}
        <div className="flex-1 p-6 relative bg-slate-50/50 dark:bg-slate-900/20">
          {isTranslating ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm z-10">
              <Loader2 className="animate-spin text-primary-500" size={32} />
            </div>
          ) : null}
          
          {translatedText ? (
            <textarea
              ref={targetRef}
              value={translatedText}
              readOnly
              className="w-full bg-transparent resize-none outline-none text-lg text-slate-800 dark:text-slate-100 min-h-[150px]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-400 min-h-[150px] opacity-60">
              <Languages size={48} className="mb-4" />
              <p>Translation will appear here</p>
            </div>
          )}

          {translatedText && (
            <button
              onClick={handleCopy}
              className="absolute bottom-4 right-4 p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-slate-500 dark:text-slate-400"
              title="Copy translation"
            >
              <Copy size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Bottom Action */}
      <div className="p-4 bg-slate-50/80 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700/50 flex justify-end">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-2.5 px-6 rounded-xl shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center gap-2"
        >
          {isTranslating ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              Translating...
            </>
          ) : (
            'Translate'
          )}
        </button>
      </div>
    </div>
  );
};

export default TranslatorCard;
