import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiGrid, FiList, FiPlus, FiAlertCircle, FiChevronLeft, FiChevronRight, FiRefreshCw, FiSearch, FiSliders } from 'react-icons/fi';

import { useTasks } from '../hooks/useTasks';
import StatsCard from '../components/StatsCard';
import TaskCard from '../components/TaskCard';
import TaskTable from '../components/TaskTable';
import SkeletonLoader from '../components/SkeletonLoader';
import ConfirmationModal from '../components/ConfirmationModal';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    tasks,
    stats,
    pagination,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    priority,
    setPriority,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    page,
    setPage,
    viewType,
    toggleViewType,
    fetchTasks,
    deleteTask,
    toggleTaskCompletion,
  } = useTasks();

  const [deleteId, setDeleteId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const handleDeleteClick = (id) => {
    setDeleteId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    setDeleteLoading(true);
    try {
      await deleteTask(deleteId);
      toast.success('Task deleted successfully');
      setDeleteId(null);
    } catch (err) {
      toast.error(err || 'Failed to delete task');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      await toggleTaskCompletion(task);
      const msg = task.status === 'completed' ? 'Task marked as active' : 'Task marked as completed!';
      toast.success(msg);
    } catch (err) {
      toast.error('Failed to update task status');
    }
  };

  // Status Filter options
  const statusOptions = [
    { label: 'All Tasks', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'In Progress', value: 'in progress' },
    { label: 'Completed', value: 'completed' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome & Quick Action Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-800 dark:text-white">
            Workspace Summary
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Analyze your progress metrics and update pending milestones.
          </p>
        </div>

        <button
          onClick={() => navigate('/add')}
          className="flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white px-5 py-3 rounded-2xl font-semibold shadow-lg shadow-violet-500/15 hover:-translate-y-0.5 active:translate-y-0 transition-all outline-none"
        >
          <FiPlus size={18} />
          <span>New Task</span>
        </button>
      </div>

      {/* Statistics Section */}
      {loading && tasks.length === 0 ? (
        <SkeletonLoader type="stats" />
      ) : (
        <StatsCard stats={stats} />
      )}

      {/* Task Filters & Control section */}
      <div className="glass-panel p-5 rounded-2xl space-y-4 shadow-sm border border-slate-200/50 dark:border-slate-800/40">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Tabs */}
          <div className="flex bg-slate-100/70 dark:bg-slate-950/40 p-1.5 rounded-xl border border-slate-200/30 dark:border-slate-850">
            {statusOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStatus(opt.value)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all outline-none ${
                  status === opt.value
                    ? 'bg-white dark:bg-slate-800 text-slate-800 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-250'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Action Row: Mobile Filters Toggle, Search, View Toggle */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            {/* Mobile Search input - Shows on small screens, syncs with Navbar search */}
            <div className="relative md:hidden flex-1 max-w-[200px]">
              <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl glass-input"
              />
            </div>

            {/* Filter Toggle Button */}
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className={`p-2.5 rounded-xl border transition-all lg:flex items-center gap-1.5 text-xs font-semibold outline-none ${
                showMobileFilters
                  ? 'bg-violet-500/10 text-violet-500 border-violet-500/20'
                  : 'bg-slate-100 dark:bg-slate-800/60 text-slate-500 border-slate-250 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <FiSliders size={16} />
              <span className="hidden sm:inline">Filters</span>
            </button>

            {/* View Grid/List Toggle */}
            <div className="flex border border-slate-250 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-800/40 rounded-xl p-1">
              <button
                onClick={() => viewType !== 'grid' && toggleViewType()}
                className={`p-2 rounded-lg transition-colors outline-none ${
                  viewType === 'grid'
                    ? 'bg-white dark:bg-slate-750 text-violet-500 shadow-sm'
                    : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Grid view"
              >
                <FiGrid size={16} />
              </button>
              <button
                onClick={() => viewType !== 'table' && toggleViewType()}
                className={`p-2 rounded-lg transition-colors outline-none ${
                  viewType === 'table'
                    ? 'bg-white dark:bg-slate-750 text-violet-500 shadow-sm'
                    : 'text-slate-450 hover:text-slate-700 dark:hover:text-slate-200'
                }`}
                title="Table view"
              >
                <FiList size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Filters: Priority & Sorting */}
        <AnimatePresence>
          {showMobileFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-200/50 dark:border-slate-800/40 pt-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Priority Selection */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                    className="glass-input py-2 text-xs rounded-xl cursor-pointer"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                {/* Sort By Field */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="glass-input py-2 text-xs rounded-xl cursor-pointer"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority Rank</option>
                  </select>
                </div>

                {/* Sort Direction */}
                <div className="flex flex-col">
                  <label className="text-xs font-bold text-slate-400 uppercase mb-2">Direction</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="glass-input py-2 text-xs rounded-xl cursor-pointer"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main Tasks Content Section */}
      <AnimatePresence mode="wait">
        {loading && tasks.length === 0 ? (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <SkeletonLoader type={viewType} count={6} />
          </motion.div>
        ) : error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-8 rounded-2xl flex flex-col items-center justify-center text-center border-red-500/10 text-slate-800 dark:text-slate-200"
          >
            <FiAlertCircle size={48} className="text-red-500 mb-4 animate-bounce" />
            <h3 className="text-lg font-bold">Failed to load tasks</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-sm">
              {error}
            </p>
            <button
              onClick={fetchTasks}
              className="mt-5 px-5 py-2.5 bg-slate-100 dark:bg-slate-800 border border-slate-250 dark:border-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 font-semibold text-sm flex items-center gap-2 outline-none transition-all duration-150"
            >
              <FiRefreshCw size={16} />
              Retry Request
            </button>
          </motion.div>
        ) : tasks.length === 0 ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="glass-panel p-12 rounded-3xl flex flex-col items-center justify-center text-center border border-slate-200/50 dark:border-slate-800/40"
          >
            {/* Minimalist SVG Illustration */}
            <svg
              className="w-48 h-48 text-slate-300 dark:text-slate-700/60 mb-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
              />
            </svg>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">
              No tasks found
            </h3>
            <p className="text-sm text-slate-505 dark:text-slate-400 mt-2 max-w-sm">
              Create a task, or modify your filters and search term to see other workspace items.
            </p>
            <button
              onClick={() => navigate('/add')}
              className="mt-6 bg-violet-600 hover:bg-violet-500 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-violet-500/10 hover:-translate-y-0.5 transition-all outline-none"
            >
              Get Started
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {viewType === 'grid' ? (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {tasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onToggleComplete={handleToggleComplete}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </motion.div>
            ) : (
              <TaskTable
                tasks={tasks}
                onToggleComplete={handleToggleComplete}
                onDelete={handleDeleteClick}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pagination Bar */}
      {!loading && tasks.length > 0 && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t border-slate-200/50 dark:border-slate-800/40 pt-6">
          <div className="text-xs font-semibold text-slate-450 dark:text-slate-500">
            Showing <span className="text-slate-700 dark:text-slate-300">{(page - 1) * pagination.limit + 1}</span> to{' '}
            <span className="text-slate-700 dark:text-slate-300">
              {Math.min(page * pagination.limit, pagination.totalTasks)}
            </span>{' '}
            of <span className="text-slate-700 dark:text-slate-300">{pagination.totalTasks}</span> entries
          </div>

          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              className="p-2 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 outline-none transition-colors duration-150"
            >
              <FiChevronLeft size={16} />
            </button>

            {Array.from({ length: pagination.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPage(idx + 1)}
                className={`h-8 w-8 rounded-lg text-xs font-semibold tracking-wide border transition-all duration-150 outline-none ${
                  page === idx + 1
                    ? 'bg-violet-500 text-white border-violet-500 shadow-md shadow-violet-500/10'
                    : 'border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
              >
                {idx + 1}
              </button>
            ))}

            <button
              disabled={page === pagination.totalPages}
              onClick={() => setPage((p) => Math.min(p + 1, pagination.totalPages))}
              className="p-2 rounded-lg border border-slate-250 dark:border-slate-800 text-slate-500 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-850 disabled:opacity-40 outline-none transition-colors duration-150"
            >
              <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message="Are you sure you want to delete this task? This action cannot be undone."
        loading={deleteLoading}
      />
    </div>
  );
};

export default Dashboard;
