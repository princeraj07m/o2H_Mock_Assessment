import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle } from 'react-icons/fi';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Delete', loading = false }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 dark:bg-slate-950/70 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="relative w-full max-w-md overflow-hidden rounded-2xl glass-panel p-6 shadow-2xl border border-slate-200 dark:border-slate-800 text-left"
          >
            <div className="flex gap-4">
              <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-xl bg-red-500/10 text-red-500 dark:bg-red-500/20 dark:text-red-400">
                <FiAlertTriangle size={24} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-6">
                  {title}
                </h3>
                <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {message}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 border-t border-slate-100 dark:border-slate-800/40 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium rounded-xl border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-350 outline-none transition-all disabled:opacity-50 min-h-[48px] sm:min-h-0"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={onConfirm}
                disabled={loading}
                className="w-full sm:w-auto px-4 py-3 sm:py-2 text-sm font-medium rounded-xl bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-lg shadow-red-500/15 outline-none transition-all disabled:opacity-50 min-h-[48px] sm:min-h-0"
              >
                {loading ? 'Processing...' : confirmText}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmationModal;
