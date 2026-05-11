import React from 'react';

const Footer = () => {
  return (
    <footer className="mt-auto py-8 text-center text-slate-500 dark:text-slate-400 text-sm">
      <p>© {new Date().getFullYear()} LinguaAI. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
