import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_SERVICE_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const authToken = localStorage.getItem("token");

    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    config.headers["Access-Control-Allow-Origin"] = "*";
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default axiosInstance;
