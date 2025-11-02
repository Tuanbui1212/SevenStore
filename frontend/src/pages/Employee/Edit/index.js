import styles from "./EditEmployee.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

function Employee() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      setShowModal(true);
      return;
    }

    // fetch(`http://localhost:5000/dashboard/employee/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // })
    //   .then((res) => res.json())
    axios
      .put(`/dashboard/employee/${id}`, formData)
      .then((res) => {
        setModalMessage(res.data.message);
        setShowModal(true);
      })
      .catch(() =>
        alert("❌ Something went wrong while updating the employee!")
      );
  };

  useEffect(() => {
    // fetch(`http://localhost:5000/dashboard/employee/${id}`)
    //   .then((res) => res.json())
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
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [id]);

  return (
    <>
      <Link to="/dashboard/employee" className={styles.btnBack}>
        Back
      </Link>

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
        >
          SAVE
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
