import axios from "axios";

const axiosClientAnalytics = axios.create({
  baseURL: import.meta.env.VITE_ANALYTIC_API_BASE_URL,
});

axiosClientAnalytics.interceptors.request.use((config) => {
  const userToken = localStorage.getItem("USER_ACCESS_TOKEN");
  if (userToken) {
    const cleanedToken = userToken.replace(/['"]+/g, '');
    config.headers.Authorization = `Bearer ${cleanedToken}`;
  }
  return config;
});

// Add response interceptor
axiosClientAnalytics.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;
    // Optional: handle auth errors
    // if (response && response.status >= 400 && response.status < 500) {
    //   localStorage.removeItem("USER");
    //   localStorage.removeItem("USER_ACCESS_TOKEN");
    // }
    return Promise.reject(error);
  }
);

export default axiosClientAnalytics;
