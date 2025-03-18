import axios from "axios";

const API_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
  }
};

export const login = (email, password) => {
  return api.post("/auth/login", { email, password });
};

export const register = (name, email, password) => {
  return api.post("/auth/register", { name, email, password });
};

export const getOpportunities = () => {
  return api.get("/opportunities");
};

export const applyToOpportunity = (opportunityId) => {
  return api.post(`/opportunities/${opportunityId}/apply`);
};

export const getUserProfile = () => {
  return api.get("/users/profile");
};

export const updateUserProfile = (userData) => {
  return api.put("/users/profile", userData);
};

export const getAppliedOpportunities = () => {
  return api.get("/users/applied-opportunities");
};

export { api };
