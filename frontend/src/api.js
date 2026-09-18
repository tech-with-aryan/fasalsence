const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.detail || 'Backend request failed')
  return data
}

export const api = {
  login: (contact, password) => request('/api/auth/login', { method: 'POST', body: JSON.stringify({ contact, password }) }),
  register: (name, contact, password) => request('/api/auth/register', { method: 'POST', body: JSON.stringify({ name, contact, password }) }),
  farm: (farmId = 1) => request(`/api/farms/${farmId}`),
  weather: (farmId = 1) => request(`/api/weather/${farmId}`),
  cropHealth: (farmId = 1) => request(`/api/crop-health/${farmId}`),
  advisory: (farmId = 1) => request(`/api/advisories/${farmId}`),
}

export { API_URL }
