import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "http://localhost:8081",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Centralised error handling
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    if (status === 401 || status === 403) {
      const isAuthPage =
        window.location.pathname === "/login" ||
        window.location.pathname === "/register";

      if (!isAuthPage) {
        const displayMessage =
          serverMessage ||
          (status === 403
            ? "You do not have permission to access this page."
            : "Please log in to continue.");

        sessionStorage.setItem("authError", displayMessage);

        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("id");

        window.location.href = "/login";
        return new Promise(() => {}); // halt — page is redirecting
      }
    }

    // Expose BE message directly on the error object
    if (serverMessage) {
      error.message = serverMessage;
    }

    return Promise.reject(error);
  }
);

export default instance;
