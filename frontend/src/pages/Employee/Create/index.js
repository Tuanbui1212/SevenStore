import styles from "./CreatEmployee.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

import { useModal } from "../../../contexts/ModalContext";

function CreateEmployee() {
  const navigate = useNavigate();
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

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
      showModal({
        title: "Error",
        message: "Please fill in all required fields!",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    axios
      .post("/dashboard/employee/create", formData)
      .then((res) => {
        showModal({
          title: "Success",
          message: "Employee created successfully!",
          type: "success",
          confirmText: "Go to List",
          onConfirm: () => navigate("/dashboard/employee")
        });
        setFormData({ name: "", role: "", status: "Full-Time", date: "" });
      })
      .catch(() => {
        showModal({
          title: "Error",
          message: "An error occurred while adding the employee.",
          type: "error",
        });
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

    </div>
  );
}

export default CreateEmployee;
