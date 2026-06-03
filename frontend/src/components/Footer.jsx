
import { Globe, MessageSquare, Mail, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="mt-auto py-12 border-t border-slate-200/50 dark:border-white/5 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        <div className="flex gap-6">
          {[
            { icon: <Globe size={20} />, href: '#' },
            { icon: <MessageSquare size={20} />, href: '#' },
            { icon: <Mail size={20} />, href: '#' }
          ].map((social, idx) => (
            <motion.a
              key={idx}
              href={social.href}
              whileHover={{ scale: 1.1, y: -2 }}
              className="p-3 bg-white/50 dark:bg-zinc-900/50 rounded-full text-slate-500 hover:text-primary-600 dark:hover:text-primary-400 border border-slate-200 dark:border-white/5 shadow-sm transition-colors"
            >
              {social.icon}
            </motion.a>
          ))}
        </div>
        
        <div className="text-center text-slate-500 dark:text-slate-400 text-sm">
          <p className="flex items-center justify-center gap-1.5 mb-2">
            Built with <Heart size={14} className="text-red-500 fill-red-500" /> by LinguaAI Team
          </p>
          <p>© {new Date().getFullYear()} LinguaAI. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
