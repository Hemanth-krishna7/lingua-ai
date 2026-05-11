import React, { useState, useEffect } from 'react';
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
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-400/20 dark:bg-primary-900/20 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-400/20 dark:bg-purple-900/20 blur-[100px]" />
      </div>

      <Header darkMode={darkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-grow container mx-auto px-4 py-8 space-y-16">
        <Hero />
        
        <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <TranslatorCard />
        </div>
        
        <div className="max-w-4xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <TranslationHistory />
        </div>

        <div className="max-w-5xl mx-auto animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <FeatureCards />
        </div>
      </main>

      <Footer />
      <Toaster position="bottom-right" />
    </div>
  );
}

export default App;
