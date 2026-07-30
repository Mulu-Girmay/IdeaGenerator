import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post("/auth/login", credentials),
};

export const ideaApi = {
  createIdea: (ideaData: { title: string; description: string }) =>
    api.post("/ideas/create", ideaData),
  GetIdeas: () => api.post("/ideas/allIdeas"),
  UpdateIdea: (ideaData: { id: string; title: string; description: string }) =>
    api.post("/ideas/update/:id", ideaData),
  deleteIdea: () => api.post("/ideas/delete/:id"),
};

export default api;
