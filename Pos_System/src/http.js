import axios from "axios";

const http = axios.create({
    baseURL : `${import.meta.env.VITE_API_BASE_URL}/api/`,
    headers: {"Content-Type": "application/json"}
})

http.interceptors.request.use((config)=>{
    const token = localStorage.getItem("ACCESS_TOKEN")
    config.headers.Authorization = `Bearer ${token}`
    return config
})

export default http;