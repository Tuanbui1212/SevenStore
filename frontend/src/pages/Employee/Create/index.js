import styles from "./CreatEmployee.module.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";

function Employee() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    status: "Full-Time",
    date: "2000-01-01",
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
      setModalMessage("Vui lòng nhập đầy đủ thông tin!");
      setShowModal(true);
      return;
    }
    fetch("http://localhost:5000/dashboard/employee/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalMessage(data.message);
        setShowModal(true);
        setFormData({ name: "", role: "", status: "Full-Time", date: "" });
      })
      .catch(() => alert("❌ Có lỗi xảy ra khi thêm nhân viên"));
  };

  return (
    <>
      <Link to="/dashboard/employee" className={styles.btnBack}>
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
            placeholder="Nhập tên nhân viên"
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
            placeholder="Nhập chức vụ"
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
          </select>
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
        <button
          type="submit"
          className={clsx(
            styles.submitBtn,
            (!formData.name || !formData.role || !formData.date) &&
              styles.disabled
          )}
          disabled={!formData.name || !formData.role || !formData.date}
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
                if (modalMessage.includes("successfully")) {
                  navigate("/dashboard/employee");
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Employee;
