import React from 'react';
import { Zap, Shield, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Zap className="text-amber-500 drop-shadow-[0_0_15px_rgba(245,158,11,0.5)]" size={32} />,
    title: 'Lightning Fast',
    description: 'Get your translations instantly with our highly optimized, low-latency AI network.'
  },
  {
    icon: <Globe className="text-blue-500 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]" size={32} />,
    title: 'Global Reach',
    description: 'Break borders with support for multiple major languages across the globe.'
  },
  {
    icon: <Shield className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.5)]" size={32} />,
    title: 'Privacy First',
    description: 'Your data is secure. We never store or log your personal translation content.'
  }
];

const FeatureCards = () => {
  return (
    <div className="py-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Why Choose LinguaAI?</h2>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Engineered for speed, accuracy, and absolute privacy.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
        {features.map((feature, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            whileHover={{ y: -10, scale: 1.02 }}
            className="glass-card p-6 md:p-8 flex flex-col items-center text-center space-y-4 md:space-y-5 bg-white/40 dark:bg-zinc-900/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 dark:bg-primary-500/5 rounded-full blur-[40px] group-hover:bg-primary-500/20 transition-colors duration-500"></div>
            <div className="p-4 bg-white/80 dark:bg-zinc-800/80 rounded-2xl shadow-inner border border-slate-100 dark:border-white/5 z-10">
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white z-10">
              {feature.title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed z-10">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;
