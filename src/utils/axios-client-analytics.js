import axios from "axios";

const axiosClient = axios.create ({baseURL: `${
        import.meta.env.VITE_ANALYTIC_API_BASE_URL }`});

// Create Interceptors
axiosClient.interceptors.request.use ( (config) => {
    const userToken = localStorage.getItem("USER_ACCESS_TOKEN");
    // Check which token is available and set the appropriate Authorization header
    if (userToken) {
        const cleanedToken = userToken.replace(/['"]+/g, '');
        config.headers.Authorization = `Bearer ${cleanedToken}`;
    }
    return config;
});
 
axiosClient.interceptors.response.use ( (response) => {
    return response;
}, (error) => {
    const {response} = error;
    // if (response && response.status >= 400 && response.status < 500) {
    //     localStorage.removeItem ("USER");
    //     localStorage.removeItem ("USER_ACCESS_TOKEN");
    // } 
    return Promise.reject (error);
});

export default axiosClient;
