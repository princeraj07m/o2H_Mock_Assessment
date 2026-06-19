import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCalendar, FiEdit2, FiTrash2, FiCheck, FiRefreshCw } from 'react-icons/fi';

const TaskTable = ({ tasks, onToggleComplete, onDelete }) => {
  const navigate = useNavigate();

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/10 text-red-500 border-red-500/20 dark:text-red-400';
      case 'medium':
        return 'bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400';
      case 'low':
      default:
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20 dark:text-blue-400';
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400';
      case 'in progress':
        return 'bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400';
      case 'pending':
      default:
        return 'bg-slate-500/10 text-slate-500 border-slate-500/20 dark:text-slate-400';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'No due date';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="glass-panel rounded-2xl overflow-hidden shadow-lg border border-slate-200/50 dark:border-slate-800/40">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200/50 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/30">
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Task</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Status</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Priority</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400">Due Date</th>
              <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-450 dark:text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-150 dark:divide-slate-800/30">
            {tasks.map((task) => {
              const isOverdue = task.status !== 'completed' && task.dueDate && new Date(task.dueDate) < new Date().setHours(0,0,0,0);
              return (
                <tr
                  key={task.id}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-900/20 transition-all duration-150"
                >
                  {/* Task Info */}
                  <td className="p-4">
                    <div className="max-w-md">
                      <p className={`font-semibold text-slate-800 dark:text-slate-100 ${
                        task.status === 'completed' ? 'line-through text-slate-400 dark:text-slate-550' : ''
                      }`}>
                        {task.title}
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 line-clamp-1 mt-0.5">
                        {task.description || 'No description'}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusStyle(task.status)}`}>
                      {task.status}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityStyle(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  {/* Due Date */}
                  <td className="p-4">
                    <div className={`flex items-center gap-1.5 text-sm ${
                      isOverdue ? 'text-red-500 dark:text-red-400 font-semibold' : 'text-slate-500 dark:text-slate-400'
                    }`}>
                      <FiCalendar size={14} className="opacity-70" />
                      <span>{formatDate(task.dueDate)}</span>
                      {isOverdue && (
                        <span className="text-[9px] uppercase font-bold tracking-tight bg-red-500/10 px-1 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1.5">
                      {/* Completion Toggle */}
                      <button
                        onClick={() => onToggleComplete(task)}
                        title={task.status === 'completed' ? 'Mark Pending' : 'Mark Completed'}
                        className={`p-2 rounded-lg border transition-colors duration-150 outline-none ${
                          task.status === 'completed'
                            ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20'
                            : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-450 border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
                        }`}
                      >
                        {task.status === 'completed' ? <FiRefreshCw size={13} /> : <FiCheck size={13} />}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/edit/${task.id}`)}
                        title="Edit Task"
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-slate-500 dark:text-slate-450 border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150 outline-none"
                      >
                        <FiEdit2 size={13} />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => onDelete(task.id)}
                        title="Delete Task"
                        className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/60 text-red-500/80 hover:text-red-500 dark:text-red-400 border border-slate-200 dark:border-slate-800 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors duration-150 outline-none"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskTable;
