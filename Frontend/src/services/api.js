import axios from 'axios'
import { ENV } from '../config/env'

const apiClient = axios.create({
  baseURL: ENV.API_URL,
})

export const getBooks = () => apiClient.get('/api/books')
export const getBookChapters = (bookId) => apiClient.get(`/api/books/${bookId}/chapters`)
