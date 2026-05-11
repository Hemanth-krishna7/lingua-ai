import React from 'react';

const Hero = () => {
  return (
    <div className="text-center space-y-4 py-8 animate-fade-in">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">
        Break Language Barriers with <br className="hidden md:block" />
        <span className="text-gradient">AI Precision</span>
      </h1>
      <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
        Experience seamless, fast, and highly accurate translations powered by advanced neural networks. 
        Communicate globally without limits.
      </p>
    </div>
  );
};

export default Hero;
