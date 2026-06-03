
import { Settings2 } from 'lucide-react';
import { motion } from 'framer-motion';

const TONE_MODES = [
  'Standard',
  'Professional',
  'Friendly',
  'Casual',
  'Respectful',
  'Business',
  'Travel',
  'Emergency'
];

const DIALECT_MODES = [
  'Standard',
  'Hinglish',
  'Hyderabadi Hindi',
  'Conversational Telugu',
  'Formal Telugu',
  'Indian English',
  'Formal Japanese',
  'Casual Japanese',
  'Respectful Japanese',
  'Anime Casual'
];


const CommunicationModes = ({ tone, setTone, dialect, setDialect, speakerProfile, setSpeakerProfile }) => {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/30 dark:bg-zinc-900/30 border-t border-slate-200/50 dark:border-white/10 gap-4 sm:gap-6">
      
      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 shrink-0">
        <Settings2 size={18} />
        <span className="text-sm font-semibold uppercase tracking-wider">Smart Mode</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto flex-1 justify-end">
        
        {/* Tone Selector */}
        <div className="relative w-full sm:w-auto flex-1 max-w-[200px]">
          <label htmlFor="tone-select" className="sr-only">Communication Tone</label>
          <select
            id="tone-select"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md text-sm font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:bg-white/90 dark:hover:bg-white/10 p-2.5 rounded-lg transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-purple-500/50"
          >
            <optgroup label="Tone">
              {TONE_MODES.map((mode) => (
                <option key={`tone-${mode}`} value={mode} className="dark:bg-zinc-900">
                  {mode === 'Standard' ? 'Tone: Standard' : mode}
                </option>
              ))}
            </optgroup>
          </select>
          {tone !== 'Standard' && (
            <motion.div layoutId="tone-active" className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
          )}
        </div>

        {/* Dialect Selector */}
        <div className="relative w-full sm:w-auto flex-1 max-w-[200px]">
          <label htmlFor="dialect-select" className="sr-only">Speaking Style & Dialect</label>
          <select
            id="dialect-select"
            value={dialect}
            onChange={(e) => setDialect(e.target.value)}
            className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md text-sm font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:bg-white/90 dark:hover:bg-white/10 p-2.5 rounded-lg transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-blue-500/50"
          >
            <optgroup label="Style / Dialect">
              {DIALECT_MODES.map((mode) => (
                <option key={`dialect-${mode}`} value={mode} className="dark:bg-zinc-900">
                  {mode === 'Standard' ? 'Style: Standard' : mode}
                </option>
              ))}
            </optgroup>
          </select>
          {dialect !== 'Standard' && (
            <motion.div layoutId="dialect-active" className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
          )}
        </div>

        {/* Speaker Profile Selector */}
        <div className="relative w-full sm:w-auto flex-1 max-w-[200px]">
          <label htmlFor="speaker-select" className="sr-only">Voice Profile</label>
          <select
            id="speaker-select"
            value={speakerProfile}
            onChange={(e) => setSpeakerProfile(e.target.value)}
            className="w-full bg-white/60 dark:bg-black/40 backdrop-blur-md text-sm font-medium text-slate-700 dark:text-slate-200 outline-none cursor-pointer hover:bg-white/90 dark:hover:bg-white/10 p-2.5 rounded-lg transition-all shadow-sm border border-slate-200 dark:border-white/10 appearance-none focus:ring-2 focus:ring-emerald-500/50"
          >
            <optgroup label="Voice Profile">
              <option value="Female" className="dark:bg-zinc-900">Profile: Female</option>
              <option value="Male" className="dark:bg-zinc-900">Profile: Male</option>
            </optgroup>
          </select>
          <motion.div layoutId="speaker-active" className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]" />
        </div>

      </div>
    </div>
  );
};

export default CommunicationModes;
