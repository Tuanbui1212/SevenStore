import { useLocation, useNavigate } from "react-router-dom";
import "../../components/GlobalStyles/GlobalStyles.scss";
import styles from "./Payment.module.scss";
import clsx from "clsx";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "../../util/axios";
import momo from "../../assets/images/momo.png";
import cod from "../../assets/images/cod.png";
import vnPay from "../../assets/images/vnPay.png";

function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { checkedItems = [], totalCost = 0 } = location.state || {};
  const [selected, setSelected] = useState("");

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [url, setUrl] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    note: "",
    payment: "",
  });

  const methods = [
    {
      id: "ShipCod",
      name: "ShipCod",
      logo: cod,
    },
    {
      id: "Momo",
      name: "MOMO",
      logo: momo,
    },
    {
      id: "VnPay",
      name: "VNPAY",
      logo: vnPay,
    },
  ];

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = localStorage.getItem("user");

    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key].trim() && key !== "note") {
        newErrors[key] = true;
      }
    });

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Form hợp lệ:", formData);
      console.log("user: ", user);
      console.log("item: ", checkedItems);

      // fetch("http://localhost:5000/payment", {
      //   method: "post",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ formData, user, checkedItems, totalCost }),
      // })
      //   .then((res) => res.json())
      axios
        .post("/payment", { formData, user, checkedItems, totalCost })
        .then((res) => {
          setUrl(res.data.url);
          setModalMessage(res.data.message);
          setShowModal(true);
        })
        .catch((err) => {
          console.error("Lỗi khi thanh toán:", err);
        });
    }
  };

  return (
    <div className={clsx("container")}>
      {/* Breadcrumb */}
      <div className={clsx("row mt-28", styles.breadcrumb)}>
        <Link className={clsx("opacity-text", styles.breadcrumb__link)} to="/">
          Home
        </Link>
        <span className={clsx("mx-5", styles.breadcrumb__divider)}> &gt; </span>
        <span className={styles.breadcrumb__link}>Checkout</span>
      </div>

      <h1 className="mt-28">Billing Details</h1>

      <div className={clsx("row mt-28")}>
        <div className={clsx("col col-8", styles.formSection)}>
          <form className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                id="name"
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className={clsx({ [styles.error]: errors.name })}
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={clsx({ [styles.error]: errors.email })}
                />
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="phone">Phone *</label>
                <input
                  id="phone"
                  type="tel"
                  name="phone"
                  required
                  value={formData.phone}
                  onChange={handleChange}
                  className={clsx({ [styles.error]: errors.phone })}
                />
              </div>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="city">City / Province *</label>
              <input
                id="city"
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className={clsx({ [styles.error]: errors.city })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="address">Address *</label>
              <input
                id="address"
                type="text"
                name="address"
                required
                value={formData.address}
                onChange={handleChange}
                className={clsx({ [styles.error]: errors.address })}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="note">Order Note (optional)</label>
              <textarea
                id="note"
                name="note"
                placeholder="Order notes..."
                value={formData.note}
                onChange={handleChange}
              ></textarea>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="paymentMethod">Payment Method</label>
              {methods.map((method) => (
                <label
                  key={method.id}
                  className={`${styles.methodItem} ${
                    selected === method.id ? styles.selected : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={selected === method.id}
                    onChange={(e) => {
                      setSelected(method.id);
                      handleChange(e);
                    }}
                  />
                  <img src={method.logo} alt={method.name} />
                  <span>{method.name}</span>
                </label>
              ))}
            </div>
          </form>
        </div>

        <div className={clsx("col col-4", styles.summarySection)}>
          <div className={styles.summaryCard}>
            <h2>Order Summary</h2>

            <div className={styles.itemsList}>
              {checkedItems.length > 0 ? (
                checkedItems.map((item, index) => (
                  <div key={index} className={styles.itemRow}>
                    <img src={item.image} alt={item.name} />
                    <div>
                      <p className={styles.itemName}>{item.name}</p>
                      <p className={styles.itemPrice}>
                        {item.cost.toLocaleString("vi-VN")}₫ × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No products selected</p>
              )}
            </div>

            <div className={styles.costInfo}>
              <div className={styles.costRow}>
                <span>Subtotal</span>
                <span>{totalCost.toLocaleString("vi-VN")}₫</span>
              </div>
              <div className={styles.costRow}>
                <span>Shipping</span>
                <span>30.000₫</span>
              </div>
              <div className={clsx(styles.costRow, styles.totalRow)}>
                <span>Total</span>
                <span>{(totalCost + 30000).toLocaleString("vi-VN")}₫</span>
              </div>
            </div>

            <button
              className={styles.checkoutBtn}
              onClick={handleSubmit}
              type="submit"
            >
              Place Order
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                navigate(url);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Payment;
