import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiSave, FiArrowLeft, FiCheckSquare, FiCalendar, FiFlag } from 'react-icons/fi';
import { useTasks } from '../hooks/useTasks';
import { taskService } from '../services/api';
import Loader from '../components/Loader';

const TaskForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createTask, updateTask } = useTasks();
  const isEditMode = !!id;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [fetchingTask, setFetchingTask] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEditMode) {
      const fetchTaskDetails = async () => {
        setFetchingTask(true);
        try {
          const res = await taskService.getById(id);
          setTitle(res.data.title);
          setDescription(res.data.description || '');
          setStatus(res.data.status || 'pending');
          setPriority(res.data.priority || 'medium');
          setDueDate(res.data.dueDate || '');
        } catch (err) {
          console.error(err);
          toast.error('Failed to retrieve task details');
          navigate('/');
        } finally {
          setFetchingTask(false);
        }
      };
      fetchTaskDetails();
    } else {
      // Default due date: Tomorrow
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      setDueDate(tomorrow.toISOString().split('T')[0]);
    }
  }, [id, isEditMode, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      return toast.warning('Title is required');
    }

    if (!description.trim() || description.trim().length < 20) {
      return toast.warning('Description must be at least 20 characters');
    }

    setSaving(true);
    const taskData = { title, description, status, priority, dueDate };

    try {
      if (isEditMode) {
        await updateTask(id, taskData);
        toast.success('Task updated successfully!');
      } else {
        await createTask(taskData);
        toast.success('Task created successfully!');
      }
      navigate('/');
    } catch (err) {
      toast.error(err || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  if (fetchingTask) {
    return <Loader />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.3 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Header back navigation */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-white border border-slate-250 dark:border-slate-800 outline-none transition-colors"
        >
          <FiArrowLeft size={18} />
        </button>
        <span className="text-sm font-semibold text-slate-550 dark:text-slate-400">
          Back to Overview
        </span>
      </div>

      <div className="glass-panel p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/50 dark:border-slate-800/40">
        <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-800/40 pb-5 mb-6">
          <div className="h-10 w-10 rounded-xl bg-violet-500/10 text-violet-500 flex items-center justify-center">
            <FiCheckSquare size={22} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white leading-none">
              {isEditMode ? 'Modify Task Details' : 'Create New Milestone'}
            </h3>
            <p className="text-xs text-slate-450 dark:text-slate-500 mt-1.5">
              Fill in all core attributes to track team deliverables.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Set up payment gateway API"
              className="glass-input text-sm"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide context, references, and checkboxes for deliverables..."
              rows={4}
              minLength={20}
              required
              className="glass-input text-sm resize-none"
            />
            <p className="text-[11px] text-slate-450 dark:text-slate-500 mt-1.5 pl-0.5">
              Minimum 20 characters ({description.trim().length}/20)
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Status Selector */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="glass-input text-sm cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            {/* Priority Selector */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                Priority Rank
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="glass-input text-sm cursor-pointer"
              >
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            {/* Due Date Input */}
            <div className="flex flex-col">
              <label className="text-xs font-bold text-slate-450 dark:text-slate-400 uppercase tracking-wider mb-2 pl-0.5">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="glass-input text-sm cursor-pointer"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-end gap-3 border-t border-slate-200/50 dark:border-slate-800/40 pt-6 mt-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="px-5 py-2.5 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 outline-none transition-colors text-sm font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl font-semibold shadow-lg shadow-violet-500/10 hover:-translate-y-0.5 active:translate-y-0 transition-all outline-none text-sm disabled:opacity-50"
            >
              <FiSave size={16} />
              <span>{saving ? 'Saving...' : isEditMode ? 'Update Task' : 'Create Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default TaskForm;
