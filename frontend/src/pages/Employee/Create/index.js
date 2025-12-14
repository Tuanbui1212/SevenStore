import styles from "./CreatEmployee.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

function CreateEmployee() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "Full-Time",
    date: new Date().toISOString().split("T")[0],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.status ||
      !formData.role ||
      !formData.date
    ) {
      setModalMessage("Please fill in all required fields!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsLoading(true);

    axios
      .post("/dashboard/employee/create", formData)
      .then((res) => {
        setModalMessage("Employee created successfully!");
        setIsSuccess(true);
        setShowModal(true);
        setFormData({ name: "", role: "", status: "Full-Time", date: "" });
      })
      .catch(() => {
        setModalMessage("❌ An error occurred while adding the employee.");
        setIsSuccess(false);
        setShowModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard/employee" className={styles.btnBack}>
        <i className="fa-solid fa-arrow-left"></i> Back to List
      </Link>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Add New Employee</h2>

        <form className={styles.employeeForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Ex: John Doe"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="role">Role / Position</label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              placeholder="Ex: Manager, Sales..."
            />
          </div>

          <div className={styles.rowGroup}>
            <div className={styles.formGroup}>
              <label htmlFor="status">Work Status</label>
              <div className={styles.selectWrapper}>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="date">Join Date</label>
              <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className={clsx(
              styles.submitBtn,
              (!formData.name ||
                !formData.role ||
                !formData.date ||
                isLoading) &&
                styles.disabled
            )}
            disabled={
              !formData.name || !formData.role || !formData.date || isLoading
            }
          >
            {isLoading ? (
              <i className="fa-solid fa-spinner fa-spin"></i>
            ) : (
              "CREATE EMPLOYEE"
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
                  navigate("/dashboard/employee");
                }
              }}
            >
              {isSuccess ? "Go to List" : "Try Again"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateEmployee;
