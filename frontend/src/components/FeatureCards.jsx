import React from 'react';
import { Zap, Shield, Globe } from 'lucide-react';

const features = [
  {
    icon: <Zap className="text-amber-500" size={24} />,
    title: 'Lightning Fast',
    description: 'Get your translations instantly with our highly optimized API network.'
  },
  {
    icon: <Globe className="text-blue-500" size={24} />,
    title: 'Multi-Language',
    description: 'Support for multiple major languages to connect you globally.'
  },
  {
    icon: <Shield className="text-green-500" size={24} />,
    title: 'Privacy First',
    description: 'Your data is secure. We don\'t store any of your personal translations.'
  }
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
      {features.map((feature, idx) => (
        <div key={idx} className="glass-card p-6 flex flex-col items-center text-center space-y-4">
          <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-2xl shadow-inner">
            {feature.icon}
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {feature.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
