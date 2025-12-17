import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import styles from "./MyOrders.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";

// Ảnh giả lập (dùng lại ảnh import hoặc link mạng)
import noOrder from "../../assets/images/no-item.jpg"; // Nhớ thay đường dẫn đúng
// Dữ liệu giả lập
const MOCK_ORDERS = [
  {
    id: "ORD-2024-001",
    date: "2024-03-20",
    status: "Pending", // Pending, Shipping, Delivered, Cancelled
    paymentMethod: "ShipCod",
    total: 5279000,
    items: [
      {
        id: 1,
        name: "AIR JORDAN 1 LOW",
        size: "42",
        quantity: 1,
        price: 5279000,
        image:
          "https://secure-images.nike.com/is/image/DotCom/553558_163_A_PREM?align=0,1&cropN=0,0,0,0&resMode=sharp&bgc=f5f5f5&fmt=jpg",
      },
    ],
  },
  {
    id: "ORD-2024-002",
    date: "2024-03-15",
    status: "Delivered",
    paymentMethod: "VnPay",
    total: 8680000,
    items: [
      {
        id: 2,
        name: "PUMA SPEEDCAT OG",
        size: "38",
        quantity: 2,
        price: 2500000,
        image:
          "https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_600,h_600/global/398846/01/sv01/fnd/VNM/fmt/png/Gi%C3%A0y-Th%E1%BB%83-Thao-Unisex-Speedcat-OG",
      },
      {
        id: 3,
        name: "ADIDAS SAMBA OG",
        size: "40",
        quantity: 1,
        price: 3680000,
        image:
          "https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/b7b2b1a2072e4d308064a8bf0116e026_9366/Giay_Samba_OG_trang_B75806_01_standard.jpg",
      },
    ],
  },
  {
    id: "ORD-2024-003",
    date: "2024-02-28",
    status: "Cancelled",
    paymentMethod: "Momo",
    total: 1840000,
    items: [
      {
        id: 4,
        name: "VANS OLD SKOOL",
        size: "39",
        quantity: 1,
        price: 1840000,
        image:
          "https://images.vans.com/is/image/Vans/VN000D3HY28-HERO?$583x583$",
      },
    ],
  },
];

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  // Tabs cấu hình
  const tabs = ["All", "Pending", "Shipping", "Delivered", "Cancelled"];

  useEffect(() => {
    // Giả lập gọi API lấy đơn hàng
    // axios.get('/my-orders')...
    setOrders(MOCK_ORDERS);
  }, []);

  // Lọc đơn hàng theo Tab
  const filteredOrders =
    activeTab === "All"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  // Helper function để hiển thị màu trạng thái
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

  return (
    <div className={clsx("container", styles.container)}>
      <h2 className={styles.pageTitle}>MY ORDERS</h2>

      {/* Tabs Navigation */}
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

      {/* Orders List */}
      <div className={styles.orderList}>
        {filteredOrders.length > 0 ? (
          filteredOrders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              {/* Header: ID, Date, Status */}
              <div className={styles.orderHeader}>
                <div className={styles.headerLeft}>
                  <span className={styles.orderId}>#{order.id}</span>
                  <span className={styles.orderDate}>{order.date}</span>
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

              {/* Body: Product Items */}
              <div className={styles.orderBody}>
                {order.items.map((item, index) => (
                  <div key={index} className={styles.productItem}>
                    <div className={styles.productImg}>
                      <img src={item.image} alt={item.name} />
                    </div>
                    <div className={styles.productInfo}>
                      <span className={styles.productName}>{item.name}</span>
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

              {/* Footer: Total & Actions */}
              <div className={styles.orderFooter}>
                <div className={styles.totalSection}>
                  <span>Total Order:</span>
                  <span className={styles.totalPrice}>
                    {order.total.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className={styles.actionButtons}>
                  <Link to={`/order/${order.id}`} className={styles.btnDetail}>
                    View Details
                  </Link>
                  {order.status === "Delivered" && (
                    <button className={styles.btnReorder}>Buy Again</button>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.noOrder}>
            <img src={noOrder} alt="No orders" />
            <p>No orders found in this category.</p>
            <Link to="/product/all" className={styles.btnShopNow}>
              SHOP NOW
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyOrders;
