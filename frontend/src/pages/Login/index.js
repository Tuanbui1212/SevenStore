import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import styles from "./AuthForm.module.scss"; // SCSS module riêng
import "../../components/GlobalStyles/GlobalStyles.scss"; // SCSS global

const AuthForm = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("login");
  const [formData, setFormData] = useState({
    name: "",
    user: "",
    password: "",
    role: "customer",
    cart: [],
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();

    const newErrors = {};
    const infor = { user: username, pass: password };

    Object.keys(infor).forEach((key) => {
      if (!infor[key]) {
        newErrors[key] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            localStorage.setItem("user", data.user);
            localStorage.setItem("success", data.success);
            localStorage.setItem("role", data.role);
            localStorage.setItem("id", data.id);

            navigate(data.redirectUrl);
          } else {
            setModalMessage(data.message || "Đăng nhập thất bại");
            setShowModal(true);
          }
        })
        .catch((err) => {
          setModalMessage("Xay ra loi" + err);
          setShowModal(true);
        });
    }
  };

  const handleSubmitRegister = (e) => {
    e.preventDefault();

    const newErrors = {};

    const infor = {
      user: formData.user,
      password: formData.password,
      name: formData.name,
    };

    Object.keys(infor).forEach((key) => {
      if (!formData[key].trim()) {
        newErrors[key] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ formData }),
      })
        .then((res) => res.json())
        .then((data) => {
          setModalMessage(data.message);
          setShowModal(true);
          if (data.message.includes("thành công")) {
            setActiveTab("login");
            setFormData({
              name: "",
              user: "",
              password: "",
              role: "customer",
              cart: [],
            });
          }
        })
        .catch((err) => {
          console.error("Lỗi khi gửi request:", err);
          setModalMessage("Đăng ký thất bại.");
          setShowModal(true);
        });
    }
  };

  return (
    <div className={clsx("container", styles.authWrapper)}>
      <div className={clsx("row", styles.authRow)}>
        <div className={clsx("col", "col-5", styles.authCol)}>
          <div className={styles.authBox}>
            <div className={styles.authTabs}>
              <button
                className={clsx({ [styles.active]: activeTab === "login" })}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={clsx({ [styles.active]: activeTab === "register" })}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            {activeTab === "login" ? (
              <form onSubmit={handleSubmitLogin} className={styles.authForm}>
                <p>
                  If you have an account, sign in with your username or email
                  address.
                </p>

                <label>
                  Username<span>*</span>
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  placeholder="Enter your username"
                  className={clsx({ ["error"]: errors.user })}
                />

                <label>
                  Password <span>*</span>
                </label>
                <input
                  value={password}
                  type="password"
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter your password"
                  className={clsx({ ["error"]: errors.pass })}
                />

                <div className={styles.authOptions}>
                  <label className={styles.remember}>
                    <input type="checkbox" /> Remember me
                  </label>
                  <Link to={"/"} className={styles.forgot}>
                    Lost your password?
                  </Link>
                </div>

                <button type="submit" className={styles.btnLogin}>
                  Log in
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmitRegister} className={styles.authForm}>
                <p>
                  There are many advantages to creating an account: the payment
                  process is faster, shipment tracking is possible and much
                  more.
                </p>

                <label>
                  Name <span>*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  className={clsx({ ["error"]: errors.name })}
                />
                <label>
                  Username <span>*</span>
                </label>
                <input
                  type="text"
                  name="user"
                  value={formData.user}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  className={clsx({ ["error"]: errors.user })}
                />

                <label>
                  Password <span>*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={clsx({ ["error"]: errors.password })}
                />

                <p>
                  Your personal data will be used to support your experience
                  throughout this website, to manage access to your account, and
                  for other purposes described in our privacy policy.
                </p>

                <button type="submit" className={clsx(styles.btnLogin)}>
                  Register
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuthForm;
