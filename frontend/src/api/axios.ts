import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
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
