import React from 'react';
import { motion } from 'framer-motion';
import { FiBriefcase, FiClock, FiActivity, FiCheckCircle } from 'react-icons/fi';

const StatsCard = ({ stats }) => {
  const cards = [
    {
      title: 'Total Tasks',
      value: stats.total,
      icon: FiBriefcase,
      color: 'from-violet-500/10 to-purple-500/10 text-violet-500 dark:text-violet-400 border-violet-500/20',
      iconBg: 'bg-violet-500/15',
      glow: 'shadow-violet-500/5',
    },
    {
      title: 'Pending',
      value: stats.pending,
      icon: FiClock,
      color: 'from-amber-500/10 to-orange-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20',
      iconBg: 'bg-amber-500/15',
      glow: 'shadow-amber-500/5',
    },
    {
      title: 'In Progress',
      value: stats.inProgress,
      icon: FiActivity,
      color: 'from-blue-500/10 to-cyan-500/10 text-blue-500 dark:text-blue-400 border-blue-500/20',
      iconBg: 'bg-blue-500/15',
      glow: 'shadow-blue-500/5',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: FiCheckCircle,
      color: 'from-emerald-500/10 to-teal-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20',
      iconBg: 'bg-emerald-500/15',
      glow: 'shadow-emerald-500/5',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -3 }}
            className={`glass-panel border bg-gradient-to-br ${card.color} p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-lg ${card.glow}`}
          >
            <div className="min-w-0">
              <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 truncate">
                {card.title}
              </p>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800 dark:text-white mt-0.5 sm:mt-1">
                {card.value}
              </h3>
            </div>
            <div className={`p-2.5 sm:p-3.5 rounded-xl shrink-0 ${card.iconBg}`}>
              <Icon size={22} className="sm:w-6 sm:h-6" />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default StatsCard;
