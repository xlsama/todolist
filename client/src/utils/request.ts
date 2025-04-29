import { up } from 'up-fetch'

export const request = up(fetch, () => ({
  baseUrl: '/',
}))
