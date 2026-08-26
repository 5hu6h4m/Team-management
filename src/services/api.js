const API_BASE_URL = 'http://localhost:5000/api';

export async function fetchFromApi(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${endpoint}, using fallback storage:`, err.message);
    return null;
  }
}

export const api = {
  // Health
  checkHealth: () => fetchFromApi('/health'),

  // Users
  getUsers: () => fetchFromApi('/users'),
  createUser: (user) => fetchFromApi('/users', { method: 'POST', body: JSON.stringify(user) }),
  updateUser: (id, user) => fetchFromApi(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) }),
  toggleUserStatus: (id) => fetchFromApi(`/users/${id}/status`, { method: 'PATCH' }),
  deleteUser: (id) => fetchFromApi(`/users/${id}`, { method: 'DELETE' }),

  // Tasks
  getTasks: () => fetchFromApi('/tasks'),
  createTask: (task) => fetchFromApi('/tasks', { method: 'POST', body: JSON.stringify(task) }),
  updateTask: (id, task) => fetchFromApi(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(task) }),
  deleteTask: (id) => fetchFromApi(`/tasks/${id}`, { method: 'DELETE' }),

  // Departments
  getDepartments: () => fetchFromApi('/departments'),
  createDepartment: (dept) => fetchFromApi('/departments', { method: 'POST', body: JSON.stringify(dept) }),

  // Notifications
  getNotifications: () => fetchFromApi('/notifications'),
  createNotification: (notif) => fetchFromApi('/notifications', { method: 'POST', body: JSON.stringify(notif) }),
  markNotificationRead: (id) => fetchFromApi(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: (userId) => fetchFromApi(`/notifications/user/${userId}/read-all`, { method: 'PATCH' }),

  // Messages
  getMessages: () => fetchFromApi('/messages'),
  sendMessage: (msg) => fetchFromApi('/messages', { method: 'POST', body: JSON.stringify(msg) }),
};
