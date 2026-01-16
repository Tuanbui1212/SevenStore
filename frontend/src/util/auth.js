import { jwtDecode } from "jwt-decode";

export const getRoleFromToken = () => {
  const token = localStorage.getItem("accessToken");

  if (!token) return null; // Chưa đăng nhập

  try {
    // Giải mã token ra thành Object
    const decoded = jwtDecode(token);

    // Token của bạn có dạng: { id, user, role, iat, exp }
    return decoded;
  } catch (error) {
    console.error("Token bị lỗi:", error);
    return null;
  }
};
