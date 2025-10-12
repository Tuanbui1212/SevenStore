import styles from "./CreatAcount.module.scss";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";

function Account() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [account, setAccount] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    user: "",
    password: "",
    cart: [],
    role: "staff",
  });

  const fetchAccount = () => {
    fetch("http://localhost:5000/dashboard/account")
      .then((res) => res.json())
      .then((data) => {
        setAccount(data.account);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
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
      setModalMessage("Vui lòng nhập đầy đủ thông tin!");
      setShowModal(true);
      return;
    }

    const existingUser = account.find((acc) => acc.user === formData.user);

    if (existingUser) {
      setModalMessage("Username đã tồn tại!");
      setShowModal(true);
      return;
    }

    fetch("http://localhost:5000/dashboard/account/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalMessage("Thêm thành công");
        setShowModal(true);
        setFormData({
          name: "",
          user: "",
          password: "",
          cart: [],
          role: "staff",
        });
      })
      .catch(() => alert("❌ Có lỗi xảy ra khi thêm nhân viên"));
  };

  return (
    <>
      <Link to="/dashboard/account" className={styles.btnBack}>
        Back
      </Link>

      <form className={styles.employeeForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="user">User</label>
          <input
            id="user"
            name="user"
            type="text"
            value={formData.user}
            onChange={handleChange}
            placeholder="Nhập tài khoản"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Nhập mật khẩu"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="role">Role</label>
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
        </div>

        <button
          type="submit"
          className={clsx(
            styles.submitBtn,
            (!formData.name ||
              !formData.user ||
              !formData.role ||
              !formData.password) &&
              styles.disabled
          )}
          disabled={
            !formData.name ||
            !formData.user ||
            !formData.role ||
            !formData.password
          }
        >
          ADD
        </button>
      </form>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
                if (modalMessage.includes("thành công")) {
                  navigate("/dashboard/account");
                }
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Account;
