// Dynamic API base URL - works from any network location
function getApiBaseUrl() {
  // In production, use relative URLs (same origin)
  if (import.meta.env.PROD) {
    return '/api';
  }
  // In development, use the same host as the frontend but port 5000
  const host = window.location.hostname;
  return `http://${host}:5000/api`;
}

export async function fetchFromApi(endpoint, options = {}) {
  const API_BASE_URL = getApiBaseUrl();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      signal: controller.signal,
      ...options,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`API Error: ${res.statusText}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn(`API call failed for ${endpoint}:`, err.message);
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
