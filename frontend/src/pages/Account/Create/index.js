import styles from "./CreateAccount.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

function CreateAccount() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [account, setAccount] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

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
      setModalMessage("Please fill in all required fields!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    const existingUser = account.find((acc) => acc.user === formData.user);

    if (existingUser) {
      setModalMessage("Username already exists!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSaving(true);

    axios
      .post(`/dashboard/account/create`, formData)
      .then((res) => {
        setModalMessage("Account created successfully!");
        setIsSuccess(true);
        setShowModal(true);
        setFormData({
          name: "",
          user: "",
          password: "",
          cart: [],
          role: "staff",
        });
      })
      .catch(() => {
        setModalMessage("❌ An error occurred while creating account.");
        setIsSuccess(false);
        setShowModal(true);
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

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div
              className={clsx(
                styles.modalIcon,
                isSuccess ? styles.success : styles.error
              )}
            >
              <i
                className={
                  isSuccess
                    ? "fa-solid fa-check-circle"
                    : "fa-solid fa-circle-xmark"
                }
              ></i>
            </div>
            <h3>{isSuccess ? "Success!" : "Error"}</h3>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
                if (isSuccess) {
                  navigate("/dashboard/account");
                }
              }}
            >
              {isSuccess ? "Go to List" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateAccount;
