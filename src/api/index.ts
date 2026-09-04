import axios from 'axios'

export const client = axios.create({
  timeout: 2 * 60 * 1000,
})
