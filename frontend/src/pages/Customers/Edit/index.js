import styles from "./EditCustomer.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";

function Customer() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

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
    fetch(`http://localhost:5000/dashboard/customers/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setFormData(data.customer);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
      setModalMessage("Vui lòng nhập đầy đủ thông tin!");
      setShowModal(true);
      return;
    }

    fetch(`http://localhost:5000/dashboard/customers/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalMessage("Sửa thành công");
        setShowModal(true);
      })
      .catch(() => alert("❌ Cập nhật thất bại"));
  };

  return (
    <>
      <Link to="/dashboard/customers" className={styles.btnBack}>
        Back
      </Link>

      <form className={styles.productForm} onSubmit={handleSubmit}>
        <h1> EDIT Customer</h1>

        <div className={clsx(styles.formGroup)}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="Nhập tên sản phẩm"
          />
        </div>

        <div className={clsx(styles.formGroup)}>
          <label htmlFor="phone">Phone</label>
          <input
            id="phone"
            type="number"
            name="phone"
            placeholder="Nhập số điện thoại"
            value={formData.phone}
            onChange={handleChange}
          ></input>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="address1">address</label>
          <input
            id={`address`}
            name={`address`}
            placeholder={`Nhập địa chỉ`}
            type="text"
            value={formData.address ?? ""}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          className={clsx(
            styles.submitBtn,
            (!formData.name || !formData.phone) && styles.disabled
          )}
          disabled={!formData.name || !formData.phone}
        >
          UPDATE
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
                  navigate("/dashboard/customers");
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

export default Customer;
