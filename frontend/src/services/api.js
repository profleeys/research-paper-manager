const API_BASE = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = data.error || data.message || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data;
}

export const authApi = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  register: (name, email, password) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    }),

  getMe: () => request('/auth/me', { method: 'GET' }),
};

export const papersApi = {
  getAll: () => request('/papers', { method: 'GET' }),

  getById: (id) => request(`/papers/${id}`, { method: 'GET' }),

  create: (paperData) =>
    request('/papers', {
      method: 'POST',
      body: JSON.stringify(paperData),
    }),

  update: (id, paperData) =>
    request(`/papers/${id}`, {
      method: 'PUT',
      body: JSON.stringify(paperData),
    }),

  delete: (id) =>
    request(`/papers/${id}`, {
      method: 'DELETE',
    }),
};

