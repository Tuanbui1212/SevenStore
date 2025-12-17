import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "./MyOrders.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";
import axios from "../../util/axios";
import noOrder from "../../assets/images/no-item.jpg";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  // --- 1. STATE QUẢN LÝ MODAL (CHUNG CHO HỦY & NHẬN) ---
  const [modal, setModal] = useState({
    show: false,
    orderId: null,
    type: null,
  });

  // --- 2. STATE QUẢN LÝ THÔNG BÁO (TOAST TỰ CHẾ) ---
  const [toast, setToast] = useState({
    show: false,
    message: "",
    type: "success",
  });

  const tabs = ["All", "Pending", "Shipping", "Delivered", "Cancelled"];

  // Tự động tắt thông báo sau 3 giây
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  const fetchMyOrders = () => {
    const currentUser = localStorage.getItem("user") || "guest";
    axios
      .get(`/my-orders?user=${currentUser}`)
      .then((res) => setOrders(res.data.order))
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMyOrders();
  }, []);

  // --- CÁC HÀM XỬ LÝ ---
  const openModal = (orderId, type) => {
    setModal({ show: true, orderId, type });
  };

  const closeModal = () => {
    setModal({ show: false, orderId: null, type: null });
  };

  const handleAction = () => {
    if (!modal.orderId || !modal.type) return;

    const isReceive = modal.type === "receive";
    const newStatus = isReceive ? "Delivered" : "Cancelled";
    const successMsg = isReceive
      ? "Order received successfully! Thank you ❤️"
      : "Order cancelled successfully.";

    axios
      .put(`/dashboard/orders/${modal.orderId}`, { status: newStatus })
      .then(() => {
        closeModal();
        fetchMyOrders();
        setToast({ show: true, message: successMsg, type: "success" });
      })
      .catch((err) => {
        console.error(err);
        closeModal();
        // Hiện thông báo lỗi
        setToast({
          show: true,
          message: "Something went wrong.",
          type: "error",
        });
      });
  };

  const filteredOrders =
    activeTab === "All" ? orders : orders.filter((o) => o.status === activeTab);

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return styles.pending;
      case "Shipping":
        return styles.shipping;
      case "Delivered":
        return styles.delivered;
      case "Cancelled":
        return styles.cancelled;
      default:
        return "";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);

    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const modalContent = {
    receive: {
      icon: <i className="fa-solid fa-box-open"></i>,
      title: "Confirm Receipt",
      desc: "Have you received this order and checked the items? This action cannot be undone.",
      btnText: "Yes, Received",
      btnClass: styles.btnConfirm,
    },
    cancel: {
      icon: (
        <i
          className="fa-solid fa-circle-xmark"
          style={{ color: "#ef4444" }}
        ></i>
      ),
      title: "Cancel Order",
      desc: "Are you sure you want to cancel this order? This action cannot be undone.",
      btnText: "Yes, Cancel",
      btnClass: styles.btnDanger,
    },
  };
  const currentModal = modalContent[modal.type] || {};

  return (
    <div className={clsx("container", styles.container)}>
      {/* --- UI THÔNG BÁO (TOAST) --- */}
      {toast.show && (
        <div className={clsx(styles.toast, styles[toast.type])}>
          <div className={styles.toastIcon}>
            {toast.type === "success" ? (
              <i className="fa-solid fa-circle-check"></i>
            ) : (
              <i className="fa-solid fa-circle-exclamation"></i>
            )}
          </div>
          <div className={styles.toastMessage}>{toast.message}</div>
        </div>
      )}

      <h2 className={styles.pageTitle}>MY ORDERS</h2>

      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab}
            className={clsx(styles.tabItem, activeTab === tab && styles.active)}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className={styles.orderList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order._id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <div className={styles.headerLeft}>
                  <span className={styles.orderId}>
                    #{order._id.slice(-6).toUpperCase()}
                  </span>
                  <span className={styles.orderDate}>
                    {formatDate(order.createdAt)}
                  </span>
                </div>
                <div
                  className={clsx(
                    styles.statusBadge,
                    getStatusClass(order.status)
                  )}
                >
                  {order.status}
                </div>
              </div>

              <div className={styles.orderBody}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.productItem}>
                    <div className={styles.productImg}>
                      <img
                        src={item.productId.image.image1}
                        alt={item.productId.name}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>
                        {item.productId.name}
                      </span>
                      <span className={styles.productDetails}>
                        Size: {item.size} x {item.quantity}
                      </span>
                    </div>
                    <div className={styles.productPrice}>
                      {item.price.toLocaleString("vi-VN")}₫
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles.orderFooter}>
                <div className={styles.totalSection}>
                  <span>Total:</span>{" "}
                  <span className={styles.totalPrice}>
                    {order.totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <div className={styles.actionButtons}>
                  <Link
                    to={`/dashboard/orders/${order._id}`}
                    className={styles.btnDetail}
                  >
                    View Details
                  </Link>

                  {/* Nút Hủy Đơn */}
                  {order.status === "Pending" && (
                    <button
                      className={styles.btnCancelOrder}
                      onClick={() => openModal(order._id, "cancel")}
                    >
                      Cancel Order
                    </button>
                  )}

                  {/* Nút Nhận Hàng */}
                  {order.status === "Shipping" && (
                    <button
                      className={styles.btnReceived}
                      onClick={() => openModal(order._id, "receive")}
                    >
                      Received Order
                    </button>
                  )}

                  {order.status === "Delivered" && (
                    <button className={styles.btnReorder}>Buy Again</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noOrder}>
            <img src={noOrder} alt="" /> <p>No orders found.</p>
            <Link to="/product/all" className={styles.btnShopNow}>
              SHOP NOW
            </Link>
          </div>
        )}
      </div>

      {modal.show && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalIcon}>{currentModal.icon}</div>
            <h3 className={styles.modalTitle}>{currentModal.title}</h3>
            <p className={styles.modalDesc}>{currentModal.desc}</p>
            <div className={styles.modalActions}>
              <button className={styles.btnCancel} onClick={closeModal}>
                Back
              </button>
              <button className={currentModal.btnClass} onClick={handleAction}>
                {currentModal.btnText}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
