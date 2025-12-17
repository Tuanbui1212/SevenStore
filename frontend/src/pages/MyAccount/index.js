import { useState, useEffect } from "react";
import styles from "./MyAccount.module.scss";
import clsx from "clsx";
import axios from "../../util/axios";

function MyAccount() {
  const [userInfo, setUserInfo] = useState({
    user: "",
    name: "",
    role: "",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState({ type: "", text: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `/account/${localStorage.getItem("id")}`
        );

        console.log("User info response:", response);
        if (response.data) {
          setUserInfo({
            user: response.data.user || "",
            name: response.data.name || "",
            role: response.data.role || "",
          });
        }
      } catch (error) {
        console.error("Failed to fetch user info", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    setMessage({ type: "", text: "" });
  };

  const handleSubmit = async () => {
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

    setIsSaving(true);

    try {
      await axios.put(`/account/${localStorage.getItem("id")}`, {
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword,
      });

      setMessage({ type: "success", text: "Password updated successfully!" });
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to update password.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>MY ACCOUNT</h2>

        {isLoading ? (
          <div className={styles.loadingState}>
            <i className="fa-solid fa-spinner fa-spin"></i> Loading info...
          </div>
        ) : (
          <div className={styles.contentWrapper}>
            <div className={styles.section}>
              <h3 className={styles.sectionHeader}>Profile Information</h3>

              <div className={styles.rowGroup}>
                <div className={styles.formGroup}>
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={userInfo.name}
                    disabled
                    className={styles.inputReadOnly}
                  />
                </div>
              </div>

              <div className={styles.rowGroup}>
                <div className={styles.formGroup}>
                  <label>User Name</label>
                  <input
                    type="text"
                    value={userInfo.user}
                    disabled
                    className={styles.inputReadOnly}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label>Role</label>
                  <input
                    type="text"
                    value={userInfo.role}
                    disabled
                    className={styles.inputReadOnly}
                  />
                </div>
              </div>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.section}>
              <h3 className={styles.sectionHeader}>Change Password</h3>
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

              <div className={styles.rowGroup}>
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
                  <label>Confirm Password</label>
                  <div className={styles.inputWrapper}>
                    <input
                      type={showPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Re-enter password"
                      value={passwordData.confirmPassword}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className={styles.showPassOption}>
                <input
                  type="checkbox"
                  id="showPass"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                <label htmlFor="showPass">Show Password</label>
              </div>

              {message.text && (
                <div className={clsx(styles.message, styles[message.type])}>
                  {message.type === "success" ? (
                    <i className="fa-solid fa-check-circle"></i>
                  ) : (
                    <i className="fa-solid fa-circle-exclamation"></i>
                  )}
                  {message.text}
                </div>
              )}

              <button
                className={clsx(styles.submitBtn, isSaving && styles.disabled)}
                onClick={handleSubmit}
                disabled={isSaving}
              >
                {isSaving ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  "SAVE CHANGES"
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyAccount;
