import axios from "axios"

const API_URL: string = import.meta.env.VITE_API_URL || "/"

const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default axiosInstance