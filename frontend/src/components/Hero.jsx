import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

const Hero = () => {
  return (
    <div className="text-center space-y-8 py-10 md:py-16 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 text-primary-600 dark:text-primary-400 font-medium text-sm border border-primary-500/20 mb-4"
      >
        <Sparkles size={16} />
        <span>Powered by Advanced AI</span>
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl"
      >
        Break Language Barriers with <br className="hidden md:block" />
        <span className="text-gradient-hero">AI Precision</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
      >
        Experience seamless, lightning-fast, and highly accurate translations powered by advanced neural networks. 
        Communicate globally without limits.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="pt-4"
      >
        <button 
          onClick={() => document.querySelector('.glass-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
          className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-300 bg-slate-900 dark:bg-white dark:text-slate-900 rounded-full hover:scale-105 hover:shadow-xl hover:shadow-primary-500/20 active:scale-95"
        >
          <span>Start Translating Now</span>
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          <div className="absolute inset-0 rounded-full border border-white/20 dark:border-black/20 pointer-events-none"></div>
        </button>
      </motion.div>
    </div>
  );
};

export default Hero;
