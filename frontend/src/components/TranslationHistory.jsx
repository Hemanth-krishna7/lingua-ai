import { useState, useEffect } from 'react';
import { History, Trash2, ArrowRight, CornerUpLeft } from 'lucide-react';
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

  const getRelativeTime = (timestamp) => {
    if (!timestamp) return 'Just now';
    const now = new Date().getTime();
    const diff = now - timestamp;
    
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (seconds < 60) {
      return 'Just now';
    } else if (minutes < 60) {
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } else if (hours < 24) {
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
    }
  };

  const examples = [
    "Hello, how are you?",
    "Nice to meet you",
    "What are you doing today?",
    "Thank you very much"
  ];

  const handleSelectExample = (text) => {
    window.dispatchEvent(new CustomEvent('populateSourceText', { detail: { text } }));
  };

  if (history.length === 0) {
    return (
      <div className="glass-card p-6 md:p-8 bg-white/40 dark:bg-zinc-900/40 border border-slate-200/50 dark:border-white/10 shadow-xl overflow-hidden relative rounded-2xl sm:rounded-3xl">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 dark:bg-primary-500/10 rounded-full blur-[80px] -z-10 pointer-events-none" />
        
        <div className="flex flex-col items-center text-center py-6">
          <div className="p-3 bg-primary-50 dark:bg-primary-500/15 text-primary-600 dark:text-primary-400 rounded-2xl mb-4 shadow-sm border border-primary-100/30">
            <History size={24} />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Welcome to LinguaAI</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
            Your translation history is empty. Select one of the quick suggestions below to get started:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
            {examples.map((example, idx) => (
              <motion.button
                key={idx}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleSelectExample(example)}
                className="p-3.5 text-left bg-white/50 dark:bg-zinc-800/50 backdrop-blur-md rounded-xl border border-slate-200/40 dark:border-white/5 hover:border-primary-400/50 dark:hover:border-primary-500/30 transition-all text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm flex items-center gap-2.5 group"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary-500 dark:bg-primary-400 group-hover:scale-125 transition-transform" />
                {example}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-xs font-bold text-primary-600 dark:text-primary-400 tracking-wide uppercase">
                  <span>{item.sourceLang}</span>
                  <ArrowRight size={14} className="text-slate-400" />
                  <span>{item.targetLang}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400 dark:text-zinc-500 font-medium">
                    {getRelativeTime(item.timestamp)}
                  </span>
                  <button
                    onClick={() => handleSelectExample(item.sourceText)}
                    className="flex items-center gap-1 text-xs font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                    title="Reuse this source text"
                  >
                    <CornerUpLeft size={12} />
                    <span>Reuse</span>
                  </button>
                </div>
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
