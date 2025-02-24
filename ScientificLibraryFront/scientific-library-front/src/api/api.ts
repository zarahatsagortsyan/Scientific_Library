// src/api/api.ts
import axios from 'axios';

// Create an Axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL, // Your API base URL
});

// Add a response interceptor for handling token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Check if the error status is 401 and the request has not been retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            try {
                const refreshToken = localStorage.getItem('refreshToken');
                const response = await axios.post(import.meta.env.VITE_API_URL +'/auth/refreshToken', {
                    refreshToken,
                });

                if (response.status === 200) {
                    const { accessToken, refreshToken: newRefreshToken } = response.data;

                    // Store the new tokens
                    localStorage.setItem('jwtToken', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Update the Authorization header and retry the original request
                    originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                    return api(originalRequest);
                }
            } catch (e) {
                console.error('Failed to refresh token:', e);
                // Clear tokens and redirect to login if refresh fails
                localStorage.removeItem('jwtToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/login';
            }
        }

        return Promise.reject(error);
    }
);

export default api;
