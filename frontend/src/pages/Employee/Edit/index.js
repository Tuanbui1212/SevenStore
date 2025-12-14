import styles from "./EditEmployee.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

function EditEmployee() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "Full-Time",
    date: "",
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
      setModalMessage("Please fill out all fields!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSaving(true);

    // fetch(`http://localhost:5000/dashboard/employee/${id}`, { ... })
    axios
      .put(`/dashboard/employee/${id}`, formData)
      .then((res) => {
        setModalMessage("Employee updated successfully!");
        setIsSuccess(true);
        setShowModal(true);
      })
      .catch(() => {
        setModalMessage("❌ Something went wrong while updating the employee!");
        setIsSuccess(false);
        setShowModal(true);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);
    // fetch(`http://localhost:5000/dashboard/employee/${id}`) ...
    axios
      .get(`/dashboard/employee/${id}`)
      .then((res) => {
        let formattedDate = "";
        if (res.data.employee && res.data.employee.date) {
          formattedDate = new Date(res.data.employee.date)
            .toISOString()
            .split("T")[0];
        }
        setFormData({
          name: res.data.employee.name,
          role: res.data.employee.role,
          status: res.data.employee.status,
          date: formattedDate,
        });
      })
      .catch((err) => {
        console.error("Lỗi fetch:", err);
        setModalMessage("Cannot load employee data.");
        setIsSuccess(false);
        setShowModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  return (
    <div className={styles.container}>
      <Link to="/dashboard/employee" className={styles.btnBack}>
        <i className="fa-solid fa-arrow-left"></i> Back to List
      </Link>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Edit Employee</h2>

        {isLoading ? (
          <div className={styles.loadingState}>
            <i className="fa-solid fa-spinner fa-spin"></i> Loading info...
          </div>
        ) : (
          <form className={styles.employeeForm} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Employee Name</label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter employee name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
                placeholder="Enter your role ..."
              />
            </div>

            <div className={styles.rowGroup}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
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
                <label htmlFor="date">Date</label>
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
                  isSaving) &&
                  styles.disabled
              )}
              disabled={
                !formData.name || !formData.role || !formData.date || isSaving
              }
            >
              {isSaving ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "SAVE CHANGES"
              )}
            </button>
          </form>
        )}
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
              {isSuccess ? "Go to List" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditEmployee;
