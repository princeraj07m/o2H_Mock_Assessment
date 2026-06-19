import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiEdit2, FiTrash2, FiCheck, FiRefreshCw } from 'react-icons/fi';

const TaskCard = ({ task, onToggleComplete, onDelete }) => {
  const navigate = useNavigate();

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20 dark:bg-red-500/15 dark:text-red-400';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:bg-amber-500/15 dark:text-amber-400';
      case 'low':
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:bg-blue-500/15 dark:text-blue-400';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/25 dark:text-emerald-450';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/25 dark:text-blue-450 animate-pulse-slow';
      case 'pending':
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/25 dark:text-slate-400';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0);

  return (
    <motion.div
      layout
      className="glass-card-interactive flex flex-col justify-between p-6 rounded-2xl h-full relative"
    >
      <div>
        {/* Header: Priority & Status Badges */}
        <div className="flex justify-between items-center mb-4">
          <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border ${getPriorityStyle(task.priority)}`}>
            {task.priority}
          </span>
          <span className={`text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full border flex items-center gap-1.5 ${getStatusStyle(task.status)}`}>
            {task.status === 'in progress' && <span className="h-1.5 w-1.5 rounded-full bg-blue-500 dark:bg-blue-400" />}
            {task.status}
          </span>
        </div>

        {/* Title */}
        <h4 className={`text-lg font-bold text-slate-800 dark:text-white leading-snug line-clamp-1 mb-2 ${
          task.status === 'completed' ? 'line-through text-slate-450 dark:text-slate-500' : ''
        }`}>
          {task.title}
        </h4>

        {/* Description */}
        <p className={`text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-4 leading-relaxed ${
          task.status === 'completed' ? 'line-through opacity-60' : ''
        }`}>
          {task.description || 'No description provided.'}
        </p>
      </div>

      {/* Footer: Date & Actions */}
      <div className="flex justify-between items-center mt-auto border-t border-slate-200/50 dark:border-slate-800/40 pt-4">
        {/* Due Date Indicator */}
        <div className={`flex items-center gap-1.5 text-xs ${
          isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-slate-400 dark:text-slate-500'
        }`}>
          <FiCalendar size={14} />
          <span>{formatDate(task.dueDate)}</span>
          {isOverdue && <span className="text-[10px] uppercase font-bold tracking-tight bg-red-500/10 px-1.5 py-0.5 rounded">Overdue</span>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          {/* Toggle Completion */}
          <button
            onClick={() => onToggleComplete(task)}
            title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
            className={`p-2 rounded-xl border transition-all duration-200 outline-none ${
              task.status === 'completed'
                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-white'
            }`}
          >
            {task.status === 'completed' ? <FiRefreshCw size={14} /> : <FiCheck size={14} />}
          </button>

          {/* Edit Task */}
          <button
            onClick={() => navigate(`/edit/${task.id}`)}
            title="Edit Task"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-850 hover:bg-slate-200 dark:hover:bg-slate-700/60 hover:text-slate-700 dark:hover:text-white transition-all duration-200 outline-none"
          >
            <FiEdit2 size={14} />
          </button>

          {/* Delete Task */}
          <button
            onClick={() => onDelete(task.id)}
            title="Delete Task"
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/60 text-red-500/80 hover:text-red-500 dark:text-red-400 border border-slate-200 dark:border-slate-850 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all duration-200 outline-none"
          >
            <FiTrash2 size={14} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
