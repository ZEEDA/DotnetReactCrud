import axios from 'axios'

// Shared axios instance pointed at the backend (see VITE_BASE_API_URL in .env)
const api = axios.create({
  baseURL: import.meta.env.VITE_BASE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

export default api
