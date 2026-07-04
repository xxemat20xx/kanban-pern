import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:5000/api',
    withCredentials: true, // IMPORTANT: sends cookies automatically
});

api.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            // Handle logout globally if needed
        }
        return Promise.reject(err);
    }
);
export default api;