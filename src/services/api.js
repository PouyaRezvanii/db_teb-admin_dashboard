// src/services/api.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'https://db-teb-api.onrender.com', // آدرس API اصلی شما
    withCredentials: true,            // ارسال کوکی‌ها به API
});
// http://localhost:5000
export default api;
