import styles from "./EditCustomer.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    setIsLoading(true);
    axios
      .get(`/dashboard/customers/${id}`)
      .then((res) => {
        setFormData({
          name: res.data.customer.name || "",
          phone: res.data.customer.phone || "",
          address: res.data.customer.address || "",
        });
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        setModalMessage("Failed to load customer information.");
        setIsSuccess(false);
        setShowModal(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      setModalMessage("Please enter name and phone number!");
      setIsSuccess(false);
      setShowModal(true);
      return;
    }

    setIsSaving(true);

    axios
      .put(`/dashboard/customers/${id}`, formData)
      .then((res) => {
        setModalMessage("Customer updated successfully!");
        setIsSuccess(true);
        setShowModal(true);
      })
      .catch(() => {
        setModalMessage("❌ Update failed. Please try again!");
        setIsSuccess(false);
        setShowModal(true);
      })
      .finally(() => {
        setIsSaving(false);
      });
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard/customers" className={styles.btnBack}>
        <i className="fa-solid fa-arrow-left"></i> Back to List
      </Link>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>Edit Customer</h2>

        {isLoading ? (
          <div className={styles.loadingState}>
            <i className="fa-solid fa-spinner fa-spin"></i> Loading info...
          </div>
        ) : (
          <form className={styles.customerForm} onSubmit={handleSubmit}>
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

            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="text"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className={clsx(
                styles.submitBtn,
                (isSaving || !formData.name || !formData.phone) &&
                  styles.disabled
              )}
              disabled={isSaving || !formData.name || !formData.phone}
            >
              {isSaving ? (
                <i className="fa-solid fa-spinner fa-spin"></i>
              ) : (
                "UPDATE CUSTOMER"
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
                  navigate("/dashboard/customers");
                }
              }}
            >
              {isSuccess ? "Back to List" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default EditCustomer;
