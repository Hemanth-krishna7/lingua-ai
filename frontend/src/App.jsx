import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Header from './components/Header';
import Hero from './components/Hero';
import TranslatorCard from './components/TranslatorCard';
import FeatureCards from './components/FeatureCards';
import TranslationHistory from './components/TranslationHistory';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-sans selection:bg-primary-500/30 w-full">
      {/* Animated Background Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none flex justify-center items-center">
        <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full bg-primary-400/20 dark:bg-primary-900/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob" />
        <div className="absolute top-[20%] right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full bg-purple-400/20 dark:bg-purple-900/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-blue-400/20 dark:bg-blue-900/20 mix-blend-multiply dark:mix-blend-screen filter blur-[100px] opacity-70 animate-blob" style={{ animationDelay: '4s' }} />
      </div>

      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-grow w-full px-0 sm:px-4 md:px-8 max-w-7xl mx-auto py-4 md:py-20 space-y-8 md:space-y-32 overflow-x-hidden">
        <Hero />
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="w-full md:max-w-5xl mx-auto relative z-10"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-primary-500 to-purple-600 rounded-3xl blur opacity-20 dark:opacity-30 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <TranslatorCard />
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full md:max-w-5xl mx-auto"
          id="history"
        >
          <TranslationHistory />
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="w-full md:max-w-6xl mx-auto"
          id="features"
        >
          <FeatureCards />
        </motion.div>
      </main>

      <Footer />
      <Toaster 
        position="bottom-right" 
        toastOptions={{
          className: 'dark:bg-zinc-800 dark:text-white',
          style: {
            borderRadius: '16px',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)',
          }
        }} 
      />
    </div>
  );
}

export default App;
