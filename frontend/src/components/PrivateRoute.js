import { Navigate } from "react-router-dom";

function PrivateRoute({ children, roles }) {
  const token =
    localStorage.getItem("accessToken") || localStorage.getItem("success");
  const userRole = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (roles && Array.isArray(roles) && !roles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default PrivateRoute;
