import { createContext, useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const location = useLocation();
  const [auth, setAuth] = useState({
    success: localStorage.getItem("success"),
    role: localStorage.getItem("role"),
    user: localStorage.getItem("user"),
  });

  useEffect(() => {
    setAuth({
      success: localStorage.getItem("success"),
      role: localStorage.getItem("role"),
      user: localStorage.getItem("user"),
    });
  }, [location.pathname]);

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
