import React, { useState, useEffect } from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const TranslationHistory = () => {
  const [history, setHistory] = useState([]);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem('translation_history');
      if (saved) {
        setHistory(JSON.parse(saved));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error('Failed to load history', e);
    }
  };

  useEffect(() => {
    loadHistory();
    window.addEventListener('translationAdded', loadHistory);
    return () => window.removeEventListener('translationAdded', loadHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('translation_history');
    setHistory([]);
    toast.success('History cleared');
  };

  if (history.length === 0) return null;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  return (
    <div className="glass-card p-5 md:p-8 bg-white/40 dark:bg-zinc-900/40 border-0 sm:border border-slate-200/50 dark:border-white/10 shadow-xl overflow-hidden relative rounded-2xl sm:rounded-3xl">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
      
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold flex items-center gap-3 text-slate-800 dark:text-white">
          <div className="p-2 bg-primary-50 dark:bg-primary-500/20 rounded-xl">
            <History size={22} className="text-primary-600 dark:text-primary-400" />
          </div>
          Recent Translations
        </h3>
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={clearHistory}
          className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors p-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 border border-transparent hover:border-red-100 dark:hover:border-red-900/30 flex items-center gap-2"
          title="Clear history"
        >
          <Trash2 size={18} />
          <span className="text-sm font-medium hidden sm:block">Clear All</span>
        </motion.button>
      </div>
      
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar"
      >
        <AnimatePresence>
          {history.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              exit={{ opacity: 0, scale: 0.9 }}
              className="p-5 bg-white/60 dark:bg-zinc-800/60 backdrop-blur-md rounded-2xl border border-slate-100 dark:border-white/5 hover:border-primary-200 dark:hover:border-primary-900/50 transition-all hover:shadow-md group"
            >
              <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 mb-3 tracking-wide uppercase">
                <span>{item.sourceLang}</span>
                <ArrowRight size={14} className="text-slate-400" />
                <span>{item.targetLang}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                <div className="relative">
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed">
                    {item.sourceText}
                  </p>
                </div>
                <div className="relative border-t md:border-t-0 md:border-l border-slate-200/50 dark:border-white/5 pt-4 md:pt-0 md:pl-8">
                  <p className="text-sm md:text-base font-medium text-slate-900 dark:text-slate-100 line-clamp-3 leading-relaxed">
                    {item.translatedText}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default TranslationHistory;
