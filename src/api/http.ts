import axios from 'axios'

export const http = axios.create({
  baseURL: '/api',
  timeout: 5000,
})

http.interceptors.request.use((config) => {
  // Avoid importing the Redux store here (prevents circular deps with mock server/bootstrap).
  // For the mock JWT flow, reading from localStorage is sufficient.
  let token: string | null = null
  try {
    const raw = localStorage.getItem('hms_admin_auth')
    if (raw) token = (JSON.parse(raw) as { token?: string }).token ?? null
  } catch {
    token = null
  }
  if (token) {
    config.headers = config.headers ?? {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

