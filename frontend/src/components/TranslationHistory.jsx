import React, { useState, useEffect } from 'react';
import { History, Trash2, ArrowRight } from 'lucide-react';
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
    // Listen for custom event when new translation is added
    window.addEventListener('translationAdded', loadHistory);
    return () => window.removeEventListener('translationAdded', loadHistory);
  }, []);

  const clearHistory = () => {
    localStorage.removeItem('translation_history');
    setHistory([]);
    toast.success('History cleared');
  };

  if (history.length === 0) return null;

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <History size={20} className="text-primary-500" />
          Recent Translations
        </h3>
        <button 
          onClick={clearHistory}
          className="text-red-500 hover:text-red-600 transition-colors p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
          title="Clear history"
        >
          <Trash2 size={18} />
        </button>
      </div>
      
      <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
        {history.map((item, idx) => (
          <div key={idx} className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-100 dark:border-slate-700">
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-2 font-medium">
              <span>{item.sourceLang}</span>
              <ArrowRight size={12} />
              <span>{item.targetLang}</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-2">
                {item.sourceText}
              </p>
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100 line-clamp-2">
                {item.translatedText}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranslationHistory;
