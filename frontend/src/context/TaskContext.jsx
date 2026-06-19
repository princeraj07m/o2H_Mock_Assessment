import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { taskService } from '../services/api';
import { useAuth } from './AuthContext';

const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, inProgress: 0, completed: 0 });
  const [pagination, setPagination] = useState({ page: 1, limit: 6, totalTasks: 0, totalPages: 1 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filters, sorting, pagination state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [priority, setPriority] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [viewType, setViewType] = useState(() => localStorage.getItem('task_view_type') || 'grid'); // grid or table

  const toggleViewType = () => {
    setViewType((prev) => {
      const next = prev === 'grid' ? 'table' : 'grid';
      localStorage.setItem('task_view_type', next);
      return next;
    });
  };

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const params = {
        search,
        status,
        priority,
        sortBy,
        sortOrder,
        page,
        limit: 6,
      };
      const res = await taskService.getAll(params);
      setTasks(res.data.tasks);
      setPagination(res.data.pagination);
      setStats(res.data.stats);
    } catch (err) {
      console.error('Error fetching tasks', err);
      setError(err.response?.data?.message || 'Failed to fetch tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, search, status, priority, sortBy, sortOrder, page]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, priority, sortBy, sortOrder]);

  const createTask = async (taskData) => {
    setLoading(true);
    try {
      const res = await taskService.create(taskData);
      await fetchTasks();
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to create task';
    } finally {
      setLoading(false);
    }
  };

  const updateTask = async (id, taskData) => {
    setLoading(true);
    try {
      const res = await taskService.update(id, taskData);
      await fetchTasks();
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to update task';
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (id) => {
    setLoading(true);
    try {
      const res = await taskService.delete(id);
      await fetchTasks();
      return res.data;
    } catch (err) {
      throw err.response?.data?.message || 'Failed to delete task';
    } finally {
      setLoading(false);
    }
  };

  const toggleTaskCompletion = async (task) => {
    const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task.id, { status: nextStatus });
    } catch (err) {
      console.error('Failed to toggle task completion', err);
      throw err;
    }
  };

  return (
    <TaskContext.Provider
      value={{
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
        createTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
export default TaskContext;
