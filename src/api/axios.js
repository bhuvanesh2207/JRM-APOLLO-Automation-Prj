import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Attach CSRF token from localStorage to requests
api.interceptors.request.use((config) => {
  const csrfToken = localStorage.getItem("csrf");
  if (csrfToken) config.headers["X-CSRFToken"] = csrfToken;
  return config;
});

// Refresh access token on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await api.post("/api/admin/refresh/");
        return api(originalRequest);
      } catch (err) {
        window.location.href = "/";
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
