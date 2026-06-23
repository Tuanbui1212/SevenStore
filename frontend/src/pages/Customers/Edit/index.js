import styles from "./EditCustomer.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";
import { useModal } from "../../../contexts/ModalContext";

function EditCustomer() {
  const navigate = useNavigate();
  const { id } = useParams();

  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

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
        showModal({
          title: "Error",
          message: "Failed to load customer information.",
          type: "error"
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      showModal({
        title: "Error",
        message: "Please enter name and phone number!",
        type: "error"
      });
      return;
    }

    setIsSaving(true);

    axios
      .put(`/dashboard/customers/${id}`, formData)
      .then((res) => {
        showModal({
          title: "Success",
          message: "Customer updated successfully!",
          type: "success",
          confirmText: "Back to List",
          onConfirm: () => navigate("/dashboard/customers")
        });
      })
      .catch(() => {
        showModal({
          title: "Error",
          message: "Update failed. Please try again!",
          type: "error"
        });
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

    </div>
  );
}

export default EditCustomer;
