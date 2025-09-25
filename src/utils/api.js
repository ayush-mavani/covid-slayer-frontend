import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear localStorage on authentication error
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Only redirect if not already on login page to prevent loops
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  logout: () => api.post("/auth/logout"),
  getMe: () => api.get("/auth/me"),
};

// Games API
export const gamesAPI = {
  createGame: (gameData) => api.post("/games", gameData),
  getGames: (page = 1, limit = 10) =>
    api.get(`/games?page=${page}&limit=${limit}`),
  getGame: (gameId) => api.get(`/games/${gameId}`),
  performAction: (gameId, actionData) =>
    api.post(`/games/${gameId}/action`, actionData),
  getStats: () => api.get("/games/stats/summary"),
};

// Users API
export const usersAPI = {
  getProfile: () => api.get("/users/profile"),
  updateProfile: (userData) => api.put("/users/profile", userData),
  getLeaderboard: (page = 1, limit = 10) =>
    api.get(`/users/leaderboard?page=${page}&limit=${limit}`),
  getRecentGames: (limit = 5) => api.get(`/users/recent-games?limit=${limit}`),
};

export default api;
