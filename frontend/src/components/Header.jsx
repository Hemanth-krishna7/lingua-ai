import React from 'react';
import { Languages, Moon, Sun } from 'lucide-react';

const Header = ({ darkMode, toggleTheme }) => {
  return (
    <header className="sticky top-0 z-50 glass border-b-0 border-x-0 border-t-0">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-gradient-to-tr from-primary-500 to-purple-500 p-2 rounded-xl text-white">
            <Languages size={24} />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600 dark:from-primary-400 dark:to-purple-400">
            LinguaAI
          </span>
        </div>
        
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300"
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </header>
  );
};

export default Header;
