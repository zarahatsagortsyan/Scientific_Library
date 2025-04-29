// import axios from 'axios';

// const api = axios.create({
//     baseURL: import.meta.env.VITE_API_URL, // Your API base URL
// });

// api.interceptors.response.use(
//     (response) => response,
//     async (error) => {
//         const originalRequest = error.config;
//         console.log(error)

//         console.log(error.response?.status)
//         console.log(error.response?.status === 401 && !originalRequest._retry)
//         if (error.response?.status === 401 && !originalRequest._retry) {
//             originalRequest._retry = true;
//             try {
//                 console.log("aaaaa; "+ !originalRequest._retry);
//                 console.log("aaaaa; "+ localStorage.getItem('refreshToken'));

//                 const refreshToken = localStorage.getItem('refreshToken');
//                 const response = await axios.post(
//                     import.meta.env.VITE_API_URL + '/Auth/refreshToken',
//                     { refreshToken }
//                   );
//                 console.log(response);

//                 if (response.status === 200) {
//                 console.log(response);

//                     const { jwtToken, refreshToken: newRefreshToken } = response.data;
//                     console.log("asdasd" + response.data)
//                     localStorage.setItem('jwtToken', jwtToken);
//                     console.log(response.status);
//                     localStorage.setItem('refreshToken', newRefreshToken);

//                     originalRequest.headers['Authorization'] = `Bearer ${jwtToken}`;
//                     return api(originalRequest);
//                 }
//             } catch (e) {
//                 console.error('Failed to refresh token:', e);
//                 localStorage.removeItem('jwtToken');
//                 localStorage.removeItem('refreshToken');
//                 // window.location.href = '/login';
//             }
//         }

//         return Promise.reject(error);
//     }
// );

// export default api;
import axios from 'axios';
import { jwtDecode } from "jwt-decode";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Optional: add Authorization header to every request if token is not expired
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) {
    try {
      const { exp } = jwtDecode<{ exp: number }>(token);
      const now = Date.now() / 1000;
      if (exp && exp > now) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Invalid JWT:', err);
    }
  }
  return config;
});

// Intercept 401 errors and try to refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error('Network error or server unavailable:', error.message);
      return Promise.reject(error);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        console.log('[🔁] Attempting to refresh token...');
        const oldRefreshToken = localStorage.getItem('refreshToken');
        if (!oldRefreshToken) throw new Error('No refresh token in storage');

        const refreshResponse = await axios.post(
          `${import.meta.env.VITE_API_URL}/Auth/refreshToken`,
          { refreshToken: oldRefreshToken }
        );

        const { jwtToken, refreshToken: newRefreshToken } = refreshResponse.data;
        if (!jwtToken || !newRefreshToken) throw new Error('Incomplete refresh response');

        localStorage.setItem('jwtToken', jwtToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        originalRequest.headers['Authorization'] = `Bearer ${jwtToken}`;
        console.log('[✅] Token refreshed, retrying request:', originalRequest.url);

        return api(originalRequest);
      } catch (e) {
        console.error('❌ Failed to refresh token:', e);
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('refreshToken');
        // Optional: redirect to login
        // window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
