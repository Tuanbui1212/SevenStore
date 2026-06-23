import styles from "./CreateAccount.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

import { useModal } from "../../../contexts/ModalContext";

function CreateAccount() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [account, setAccount] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    user: "",
    password: "",
    cart: [],
    role: "staff",
  });

  const fetchAccount = () => {
    axios
      .get(`/dashboard/account`)
      .then((response) => {
        setAccount(response.data.account);
      })
      .catch((err) => console.error("Lỗi fetch:", err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.user ||
      !formData.role ||
      !formData.password
    ) {
      showModal({
        title: "Error",
        message: "Please fill in all required fields!",
        type: "error",
      });
      return;
    }

    const existingUser = account.find((acc) => acc.user === formData.user);

    if (existingUser) {
      showModal({
        title: "Error",
        message: "Username already exists!",
        type: "error",
      });
      return;
    }

    setIsSaving(true);

    axios
      .post(`/dashboard/account/create`, formData)
      .then((res) => {
        showModal({
          title: "Success",
          message: "Account created successfully!",
          type: "success",
          confirmText: "Go to List",
          onConfirm: () => navigate("/dashboard/account")
        });
        setFormData({
          name: "",
          user: "",
          password: "",
          cart: [],
          role: "staff",
        });
      })
      .catch(() => {
        showModal({
          title: "Error",
          message: "An error occurred while creating account.",
          type: "error",
        });
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard/account" className={styles.btnBack}>
        <i className="fa-solid fa-arrow-left"></i> Back to List
      </Link>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Create New Account</h2>

        <form className={styles.accountForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter full name"
            />
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="user">Username</label>
              <input
                id="user"
                name="user"
                type="text"
                value={formData.user}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <div className={styles.selectWrapper}>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                >
                  <option value="staff">Staff</option>
                  <option value="admin">Admin</option>
                  <option value="customer">Customer</option>
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className={clsx(
              styles.submitBtn,
              (isSaving ||
                !formData.name ||
                !formData.user ||
                !formData.password) &&
                styles.disabled
            )}
            disabled={
              isSaving || !formData.name || !formData.user || !formData.password
            }
          >
            {isSaving ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "CREATE ACCOUNT"
            )}
          </button>
        </form>
      </div>

    </div>
  );
}

export default CreateAccount;
