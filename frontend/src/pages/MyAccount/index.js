import { useState, useEffect } from "react";
import styles from "./MyAccount.module.scss";
import clsx from "clsx";
import axios from "../../util/axios"; // Đường dẫn axios của bạn

function MyAccount() {
  // 1. State lưu thông tin User (Lấy từ localStorage hoặc API)
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    fullName: "",
    phone: "",
    role: "",
  });

  // 2. State lưu dữ liệu đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" }); // Thông báo lỗi/thành công
  const [showPassword, setShowPassword] = useState(false); // Ẩn/hiện mật khẩu

  // Giả lập lấy dữ liệu user khi vào trang
  useEffect(() => {
    // Thay đoạn này bằng API thực tế hoặc lấy từ localStorage
    // Ví dụ: const user = JSON.parse(localStorage.getItem("user"));
    const mockUser = {
      username: "sneakerhead99",
      email: "customer@example.com",
      fullName: "Nguyen Van A",
      phone: "0987654321",
      role: "Member",
    };
    setUserInfo(mockUser);
  }, []);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" }); // Reset thông báo khi gõ
  };

  const handleSubmit = async () => {
    // Validate cơ bản
    if (
      !passwordData.oldPassword ||
      !passwordData.newPassword ||
      !passwordData.confirmPassword
    ) {
      setMessage({
        type: "error",
        text: "Please fill in all password fields.",
      });
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: "error", text: "New passwords do not match." });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password must be at least 6 characters.",
      });
      return;
    }

    // Call API đổi mật khẩu
    try {
      // const res = await axios.post("/user/change-password", {
      //    oldPassword: passwordData.oldPassword,
      //    newPassword: passwordData.newPassword
      // });

      // Giả lập thành công
      console.log("Change password logic here", passwordData);
      setMessage({ type: "success", text: "Password updated successfully!" });

      // Reset form
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong.",
      });
    }
  };

  return (
    <div className={clsx("container", styles.accountPage)}>
      <h1 className={styles.pageTitle}>MY ACCOUNT</h1>

      <div className={styles.layout}>
        {/* --- PHẦN 1: THÔNG TIN TÀI KHOẢN (READ ONLY) --- */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>ACCOUNT DETAILS</h3>
          <div className={styles.formGroup}>
            <label>Username</label>
            <input
              type="text"
              value={userInfo.username}
              disabled
              className={styles.inputReadOnly}
            />
          </div>
          <div className={styles.formGroup}>
            <label>Email</label>
            <input
              type="email"
              value={userInfo.email}
              disabled
              className={styles.inputReadOnly}
            />
          </div>
          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label>Full Name</label>
              <input
                type="text"
                value={userInfo.fullName}
                disabled
                className={styles.inputReadOnly}
              />
            </div>
            <div className={styles.formGroup}>
              <label>Phone Number</label>
              <input
                type="text"
                value={userInfo.phone}
                disabled
                className={styles.inputReadOnly}
              />
            </div>
          </div>
        </div>

        {/* --- PHẦN 2: ĐỔI MẬT KHẨU --- */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>SECURITY & PASSWORD</h3>
          <p className={styles.desc}>
            Ensure your account is using a long, random password to stay secure.
          </p>

          <div className={styles.passwordForm}>
            <div className={styles.formGroup}>
              <label>Current Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="oldPassword"
                  placeholder="Enter current password"
                  value={passwordData.oldPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  placeholder="Enter new password"
                  value={passwordData.newPassword}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label>Confirm New Password</label>
              <div className={styles.inputWrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter new password"
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                />
                <i
                  className={clsx(
                    "fa-solid",
                    showPassword ? "fa-eye-slash" : "fa-eye",
                    styles.eyeIcon
                  )}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>

            {/* Thông báo lỗi/thành công */}
            {message.text && (
              <div className={clsx(styles.message, styles[message.type])}>
                {message.text}
              </div>
            )}

            <button className={styles.saveBtn} onClick={handleSubmit}>
              SAVE CHANGES
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyAccount;
