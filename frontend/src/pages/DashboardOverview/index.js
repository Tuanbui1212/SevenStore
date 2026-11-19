import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./DashboardOverview.module.scss";
import axios from "../../util/axios";

function DashboardOverview() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [pendingCount, setPendingCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const currentUser = localStorage.getItem("user") || "Admin";
  const userRole = localStorage.getItem("role") || "staff";

  useEffect(() => {
    setIsLoading(true);
    Promise.all([
      axios.get("/dashboard/orders/stats").catch(() => ({ data: {} })),
      axios.get("/dashboard/orders/count-pending").catch(() => ({ data: { count: 0 } })),
    ])
      .then(([statsRes, pendingRes]) => {
        if (statsRes.data) {
          setStats({
            totalRevenue: statsRes.data.totalRevenue || 0,
            totalOrders: statsRes.data.totalOrders || 0,
            totalProducts: statsRes.data.totalProducts || 0,
            totalCustomers: statsRes.data.totalCustomers || 0,
          });
        }
        if (pendingRes.data) {
          setPendingCount(pendingRes.data.count || 0);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.welcomeCard}>
        <h1 className={styles.welcomeTitle}>
          Welcome back, {currentUser}! 👋
        </h1>
        <p className={styles.welcomeSubtitle}>
          SevenStore Administration & Operations Portal ({userRole.toUpperCase()})
        </p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.iconRevenue}`}>
            <i className="fa-solid fa-dong-sign"></i>
          </div>
          <div>
            <p className={styles.statLabel}>Total Revenue</p>
            <h3 className={styles.statValue}>
              {isLoading ? "..." : `${stats.totalRevenue.toLocaleString("vi-VN")}₫`}
            </h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.iconOrders}`}>
            <i className="fa-solid fa-boxes-packing"></i>
          </div>
          <div>
            <p className={styles.statLabel}>Orders</p>
            <h3 className={styles.statValue}>
              {isLoading ? "..." : stats.totalOrders}
              {pendingCount > 0 && (
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: "#dc2626",
                    marginLeft: "8px",
                    fontWeight: "normal",
                  }}
                >
                  ({pendingCount} pending)
                </span>
              )}
            </h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.iconProducts}`}>
            <i className="fa-solid fa-shoe-prints"></i>
          </div>
          <div>
            <p className={styles.statLabel}>Products</p>
            <h3 className={styles.statValue}>
              {isLoading ? "..." : stats.totalProducts}
            </h3>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={`${styles.iconBox} ${styles.iconCustomers}`}>
            <i className="fa-solid fa-users"></i>
          </div>
          <div>
            <p className={styles.statLabel}>Customers</p>
            <h3 className={styles.statValue}>
              {isLoading ? "..." : stats.totalCustomers}
            </h3>
          </div>
        </div>
      </div>

      <h2 className={styles.sectionTitle}>Quick Actions</h2>
      <div className={styles.actionsGrid}>
        <Link to="/dashboard/products/create" className={styles.actionButton}>
          <i className="fa-solid fa-plus-circle"></i>
          <span>Add New Product</span>
        </Link>
        <Link to="/dashboard/orders/manage/active" className={styles.actionButton}>
          <i className="fa-solid fa-clock"></i>
          <span>Process Orders</span>
        </Link>
        <Link to="/dashboard/products" className={styles.actionButton}>
          <i className="fa-solid fa-box-open"></i>
          <span>Manage Inventory</span>
        </Link>
        <Link to="/dashboard/customers" className={styles.actionButton}>
          <i className="fa-solid fa-address-book"></i>
          <span>Customer Directory</span>
        </Link>
        {userRole === "admin" && (
          <Link to="/dashboard/report" className={styles.actionButton}>
            <i className="fa-solid fa-chart-line"></i>
            <span>Financial Report</span>
          </Link>
        )}
      </div>
    </div>
  );
}

export default DashboardOverview;

