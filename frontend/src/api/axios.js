import api from "axios";

const api = api.create({
  baseURL: "https://localhost:5000/api",
  Headers: { "Content-Type": "application/json" },
});
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
});
export default api;
