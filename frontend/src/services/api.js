import axios from 'axios';

// Set this to a real backend URL if available
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';
export const IS_MOCK = !API_BASE_URL;

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach auth tokens
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('task_manager_token');
  if (token && !IS_MOCK) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }
  return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !IS_MOCK) {
      localStorage.removeItem('task_manager_token');
      localStorage.removeItem('task_manager_user');
    }
    return Promise.reject(error);
  }
);

// ==========================================
// MOCK DATABASE & API LATENCY SIMULATOR
// ==========================================

const sleep = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

const getStoredData = (key, defaultVal = []) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
};

const setStoredData = (key, data) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Initialize Mock Data if empty
const initMockData = () => {
  const users = getStoredData('mock_users');
  const tasks = getStoredData('mock_tasks');

  if (users.length === 0) {
    // Default demo user (password is "password")
    users.push({
      id: 'user-1',
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password', // in mock database we store plain text for simplicity
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      coverImage: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=800',
      bio: 'SaaS product manager & frontend enthusiast.',
    });
    setStoredData('mock_users', users);
  }

  if (tasks.length === 0) {
    const demoTasks = [
      {
        id: 'task-1',
        title: 'Design onboarding flow',
        description: 'Create high-fidelity wireframes and user journeys for the new workspace activation flow in Figma.',
        status: 'in progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days from now
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        userId: 'user-1',
      },
      {
        id: 'task-2',
        title: 'Setup Vite + React Router',
        description: 'Initialize a clean project repository, install dependencies, and configure routes for dashboard layouts.',
        status: 'completed',
        priority: 'medium',
        dueDate: new Date().toISOString().split('T')[0],
        createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        userId: 'user-1',
      },
      {
        id: 'task-3',
        title: 'Review pull request #108',
        description: 'Review the backend schema changes for collaborative real-time editing feature.',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        userId: 'user-1',
      },
      {
        id: 'task-4',
        title: 'Implement Dark Mode theme',
        description: 'Integrate custom CSS variables and Tailwind configuration to support persistent dark mode switching.',
        status: 'in progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 86400000 * 1).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        userId: 'user-1',
      },
      {
        id: 'task-5',
        title: 'Write unit tests for AuthContext',
        description: 'Add tests verifying user registration validation, session state restoration, and profile changes.',
        status: 'pending',
        priority: 'low',
        dueDate: new Date(Date.now() + 86400000 * 7).toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        userId: 'user-1',
      }
    ];
    setStoredData('mock_tasks', demoTasks);
  }
};

initMockData();

// Mock API Actions
const mockApi = {
  auth: {
    login: async (email, password) => {
      await sleep();
      const users = getStoredData('mock_users');
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
      if (!user) {
        throw { response: { data: { message: 'Invalid email or password' } } };
      }
      const token = `mock-token-${user.id}-${Date.now()}`;
      localStorage.setItem('task_manager_token', token);
      localStorage.setItem('task_manager_user', JSON.stringify(user));
      return { data: { token, user } };
    },
    register: async (name, email, password) => {
      await sleep();
      const users = getStoredData('mock_users');
      const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (exists) {
        throw { response: { data: { message: 'Email already registered' } } };
      }
      const newUser = {
        id: `user-${Date.now()}`,
        name,
        email,
        password,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(name)}`,
        coverImage: '',
        bio: 'Hello! I am a new user.',
      };
      users.push(newUser);
      setStoredData('mock_users', users);
      const token = `mock-token-${newUser.id}-${Date.now()}`;
      localStorage.setItem('task_manager_token', token);
      localStorage.setItem('task_manager_user', JSON.stringify(newUser));
      return { data: { token, user: newUser } };
    },
    getProfile: async () => {
      await sleep(200);
      const user = localStorage.getItem('task_manager_user');
      if (!user) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
      return { data: JSON.parse(user) };
    },
    updateProfile: async (profileData) => {
      await sleep();
      const activeUser = JSON.parse(localStorage.getItem('task_manager_user'));
      if (!activeUser) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
      
      const users = getStoredData('mock_users');
      const userIndex = users.findIndex(u => u.id === activeUser.id);
      
      if (userIndex === -1) throw { response: { data: { message: 'User not found' } } };

      const updatedUser = {
        ...users[userIndex],
        name: profileData.name || users[userIndex].name,
        bio: profileData.bio !== undefined ? profileData.bio : users[userIndex].bio,
        avatar: profileData.avatar || users[userIndex].avatar,
        coverImage: profileData.coverImage !== undefined ? profileData.coverImage : users[userIndex].coverImage,
      };

      if (profileData.password) {
        updatedUser.password = profileData.password;
      }

      users[userIndex] = updatedUser;
      setStoredData('mock_users', users);
      localStorage.setItem('task_manager_user', JSON.stringify(updatedUser));
      return { data: updatedUser };
    }
  },
  tasks: {
    getAll: async (params = {}) => {
      await sleep();
      const activeUser = JSON.parse(localStorage.getItem('task_manager_user'));
      if (!activeUser) throw { response: { status: 401, data: { message: 'Unauthorized' } } };
      
      let allTasks = getStoredData('mock_tasks').filter(t => t.userId === activeUser.id);

      // Search filter
      if (params.search) {
        const query = params.search.toLowerCase();
        allTasks = allTasks.filter(t => 
          t.title.toLowerCase().includes(query) || 
          t.description.toLowerCase().includes(query)
        );
      }

      // Status filter
      if (params.status && params.status !== 'all') {
        allTasks = allTasks.filter(t => t.status === params.status);
      }

      // Priority filter
      if (params.priority && params.priority !== 'all') {
        allTasks = allTasks.filter(t => t.priority === params.priority);
      }

      // Sorting
      if (params.sortBy) {
        const order = params.sortOrder === 'desc' ? -1 : 1;
        allTasks.sort((a, b) => {
          if (params.sortBy === 'dueDate') {
            return (new Date(a.dueDate || 0) - new Date(b.dueDate || 0)) * order;
          }
          if (params.sortBy === 'priority') {
            const priorityVal = { low: 1, medium: 2, high: 3 };
            return (priorityVal[a.priority] - priorityVal[b.priority]) * order;
          }
          // Default: createdAt
          return (new Date(a.createdAt || 0) - new Date(b.createdAt || 0)) * order;
        });
      }

      // Pagination
      const page = parseInt(params.page) || 1;
      const limit = parseInt(params.limit) || 6;
      const totalTasks = allTasks.length;
      const totalPages = Math.ceil(totalTasks / limit);
      const paginatedTasks = allTasks.slice((page - 1) * limit, page * limit);

      // Stats computations (based on user tasks prior to filters, but after auth)
      const userTasks = getStoredData('mock_tasks').filter(t => t.userId === activeUser.id);
      const stats = {
        total: userTasks.length,
        pending: userTasks.filter(t => t.status === 'pending').length,
        inProgress: userTasks.filter(t => t.status === 'in progress').length,
        completed: userTasks.filter(t => t.status === 'completed').length,
      };

      return {
        data: {
          tasks: paginatedTasks,
          pagination: {
            page,
            limit,
            totalTasks,
            totalPages,
          },
          stats,
        }
      };
    },
    getById: async (id) => {
      await sleep(150);
      const activeUser = JSON.parse(localStorage.getItem('task_manager_user'));
      if (!activeUser) throw { response: { status: 401 } };
      
      const tasks = getStoredData('mock_tasks');
      const task = tasks.find(t => t.id === id && t.userId === activeUser.id);
      if (!task) throw { response: { status: 404, data: { message: 'Task not found' } } };
      return { data: task };
    },
    create: async (taskData) => {
      await sleep();
      const activeUser = JSON.parse(localStorage.getItem('task_manager_user'));
      if (!activeUser) throw { response: { status: 401 } };

      const tasks = getStoredData('mock_tasks');
      const newTask = {
        id: `task-${Date.now()}`,
        title: taskData.title,
        description: taskData.description || '',
        status: taskData.status || 'pending',
        priority: taskData.priority || 'medium',
        dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
        createdAt: new Date().toISOString(),
        userId: activeUser.id,
      };
      
      tasks.unshift(newTask); // Add to beginning
      setStoredData('mock_tasks', tasks);
      return { data: newTask };
    },
    update: async (id, taskData) => {
      await sleep();
      const activeUser = JSON.parse(localStorage.getItem('task_manager_user'));
      if (!activeUser) throw { response: { status: 401 } };

      const tasks = getStoredData('mock_tasks');
      const index = tasks.findIndex(t => t.id === id && t.userId === activeUser.id);
      if (index === -1) throw { response: { status: 404, data: { message: 'Task not found' } } };

      const updatedTask = {
        ...tasks[index],
        title: taskData.title !== undefined ? taskData.title : tasks[index].title,
        description: taskData.description !== undefined ? taskData.description : tasks[index].description,
        status: taskData.status !== undefined ? taskData.status : tasks[index].status,
        priority: taskData.priority !== undefined ? taskData.priority : tasks[index].priority,
        dueDate: taskData.dueDate !== undefined ? taskData.dueDate : tasks[index].dueDate,
        updatedAt: new Date().toISOString(),
      };

      tasks[index] = updatedTask;
      setStoredData('mock_tasks', tasks);
      return { data: updatedTask };
    },
    delete: async (id) => {
      await sleep();
      const activeUser = JSON.parse(localStorage.getItem('task_manager_user'));
      if (!activeUser) throw { response: { status: 401 } };

      const tasks = getStoredData('mock_tasks');
      const filteredTasks = tasks.filter(t => !(t.id === id && t.userId === activeUser.id));
      
      if (tasks.length === filteredTasks.length) {
        throw { response: { status: 404, data: { message: 'Task not found' } } };
      }

      setStoredData('mock_tasks', filteredTasks);
      return { data: { success: true } };
    }
  }
};

const buildRegisterFormData = (name, email, password, files = {}) => {
  const formData = new FormData();
  formData.append('name', name);
  formData.append('email', email);
  formData.append('password', password);
  if (files.avatar) formData.append('avatar', files.avatar);
  if (files.coverImage) formData.append('coverImage', files.coverImage);
  return formData;
};

const buildProfileFormData = (data = {}, files = {}) => {
  const formData = new FormData();
  if (data.name !== undefined) formData.append('name', data.name);
  if (data.bio !== undefined) formData.append('bio', data.bio);
  if (data.password) formData.append('password', data.password);
  if (files.avatar) {
    formData.append('avatar', files.avatar);
  } else if (data.avatar) {
    formData.append('avatar', data.avatar);
  }
  if (files.coverImage) formData.append('coverImage', files.coverImage);
  return formData;
};

// Hook up real network endpoints if baseUrl is set
export const authService = {
  login: (email, password) =>
    IS_MOCK ? mockApi.auth.login(email, password) : api.post('/auth/login', { email, password }),
  register: (name, email, password, files = {}) =>
    IS_MOCK
      ? mockApi.auth.register(name, email, password)
      : api.post('/auth/register', buildRegisterFormData(name, email, password, files)),
  getProfile: () =>
    IS_MOCK ? mockApi.auth.getProfile() : api.get('/auth/profile'),
  updateProfile: (data, files = {}) =>
    IS_MOCK
      ? mockApi.auth.updateProfile(data)
      : api.put('/auth/profile', buildProfileFormData(data, files)),
  updateAvatar: (file) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.patch('/auth/avatar', formData);
  },
  updateCoverImage: (file) => {
    const formData = new FormData();
    formData.append('coverImage', file);
    return api.patch('/auth/cover-image', formData);
  },
};

export const taskService = {
  getAll: (params) => 
    IS_MOCK ? mockApi.tasks.getAll(params) : api.get('/tasks', { params }),
  getById: (id) => 
    IS_MOCK ? mockApi.tasks.getById(id) : api.get(`/tasks/${id}`),
  create: (data) => 
    IS_MOCK ? mockApi.tasks.create(data) : api.post('/tasks', data),
  update: (id, data) => 
    IS_MOCK ? mockApi.tasks.update(id, data) : api.put(`/tasks/${id}`, data),
  delete: (id) => 
    IS_MOCK ? mockApi.tasks.delete(id) : api.delete(`/tasks/${id}`),
};

export default api;
