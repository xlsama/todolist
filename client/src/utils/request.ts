import { up } from 'up-fetch'

export const request = up(fetch, () => ({
  baseUrl: import.meta.env.DEV ? '/' : import.meta.env.VITE_BASE_API_URL,
}))
