// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://db-teb-api.onrender.com', 
    withCredentials: true,           
});
// http://localhost:5000
export default api;
