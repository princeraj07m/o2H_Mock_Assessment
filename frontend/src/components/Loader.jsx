import React from 'react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/30 dark:bg-slate-950/40 backdrop-blur-md'
    : 'flex items-center justify-center p-8 w-full';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={containerClasses}
    >
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <motion.div
          className="h-16 w-16 rounded-full border-4 border-violet-500/20 border-t-violet-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        {fullScreen && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 text-sm font-semibold tracking-wider text-slate-600 dark:text-slate-300 uppercase animate-pulse"
          >
            Loading portal...
          </motion.p>
        )}
      </div>
    </motion.div>
  );
};

export default Loader;
