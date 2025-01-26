import axios from 'axios';

const API_BASE_URL = 'https://db-teb-api.onrender.com';

export const signIn = async (credentials) => {
    const response = await axios.post(`${API_BASE_URL}/signin`, credentials, {
        withCredentials: true, // برای ذخیره session
    });
    return response.data;
};

export const signUp = async (userInfo) => {
    const response = await axios.post(`${API_BASE_URL}/signup`, userInfo, {
        withCredentials: true,
    });
    return response.data;
};
