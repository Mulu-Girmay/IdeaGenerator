import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

// Request interceptor - add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Check if token is expired before sending
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const expiryTime = payload.exp * 1000;
        if (Date.now() >= expiryTime) {
          localStorage.removeItem("token");
          window.location.href = "/login"; // Redirect to login
          return Promise.reject(new Error("Token expired"));
        }
      } catch (error) {
        localStorage.removeItem("token");
        window.location.href = "/login";
        return Promise.reject(new Error("Invalid token"));
      }
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor - handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
};

export const ideaApi = {
  createIdea: (ideaData: { title: string; details: string }) =>
    api.post("/ideas/create", ideaData),
  getIdeas: () => api.get("/ideas/allIdeas"),
  updateIdea: (id: string, ideaData: { title: string; details: string }) =>
    api.patch(`/ideas/update/${id}`, ideaData),
  deleteIdea: (id: string) => api.delete(`/ideas/delete/${id}`),
};

export default api;
