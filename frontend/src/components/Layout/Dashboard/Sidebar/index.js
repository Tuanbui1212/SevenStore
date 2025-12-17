import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./Sidebar.module.scss";
import "../../../GlobalStyles/GlobalStyles.scss";
import AdminLogo from "../../../../assets/images/elements.png";
import axios from "../../../../util/axios";

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const isActive = (path) => location.pathname.includes(path);

  useEffect(() => {
    const fetchPendingCount = async () => {
      try {
        const response = await axios.get("/dashboard/orders/count-pending");
        setPendingCount(response.data.count || 0);
      } catch (error) {
        console.error(error);
      }
    };
    if (role === "admin") fetchPendingCount();
  }, [role]);

  return (
    <div className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <i
          className={clsx(
            "fa-solid",
            isCollapsed ? "fa-chevron-right" : "fa-chevron-left"
          )}
        ></i>
      </button>

      <div className={styles.header}>
        <img src={AdminLogo} alt="Logo" className={styles.logo} />
        <div className={styles.brandInfo}>
          <span className={styles.brandTitle}>Admin Panel</span>
          <span className={styles.brandSubtitle}>System Manager</span>
        </div>
      </div>

      <ul className={styles.menuList}>
        {!isCollapsed && <li className={styles.menuLabel}>RESOURCE</li>}

        {role === "admin" && (
          <li>
            <Link
              to="/dashboard/employee"
              className={clsx(
                styles.menuItem,
                isActive("/dashboard/employee") && styles.active
              )}
              title={isCollapsed ? "Employee" : ""}
            >
              <i className="fa-solid fa-users-gear"></i>
              <span className={styles.menuText}>Employee</span>
            </Link>
          </li>
        )}

        <li>
          <Link
            to="/dashboard/products"
            className={clsx(
              styles.menuItem,
              isActive("/dashboard/products") && styles.active
            )}
            title={isCollapsed ? "Products" : ""}
          >
            <i className="fa-solid fa-box-open"></i>
            <span className={styles.menuText}>Products</span>
          </Link>
        </li>

        <li>
          <Link
            to="/dashboard/customers"
            className={clsx(
              styles.menuItem,
              isActive("/dashboard/customers") && styles.active
            )}
            title={isCollapsed ? "Customers" : ""}
          >
            <i className="fa-solid fa-address-book"></i>
            <span className={styles.menuText}>Customers</span>
          </Link>
        </li>

        {!isCollapsed && <li className={styles.menuLabel}>SALES</li>}

        <li>
          <Link
            to="/dashboard/orders/manage/active"
            className={clsx(
              styles.menuItem,
              isActive("/dashboard/orders/manage/active") && styles.active
            )}
            title={isCollapsed ? "Active Orders" : ""}
          >
            <i className="fa-solid fa-bell-concierge"></i>
            <span className={styles.menuText}>Active Orders</span>
            {pendingCount > 0 && (
              <span className={styles.badge}>{pendingCount}</span>
            )}
          </Link>
        </li>

        <li>
          <Link
            to="/dashboard/orders/manage/history"
            className={clsx(
              styles.menuItem,
              isActive("/dashboard/orders/manage/history") && styles.active
            )}
            title={isCollapsed ? "Order History" : ""}
          >
            <i className="fa-solid fa-clock-rotate-left"></i>
            <span className={styles.menuText}>Order History</span>
          </Link>
        </li>

        {role === "admin" && (
          <>
            {!isCollapsed && <li className={styles.menuLabel}>SYSTEM</li>}
            <li>
              <Link
                to="/dashboard/report"
                className={clsx(
                  styles.menuItem,
                  isActive("/dashboard/report") && styles.active
                )}
                title={isCollapsed ? "Report" : ""}
              >
                <i className="fa-solid fa-chart-line"></i>
                <span className={styles.menuText}>Report</span>
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/account"
                className={clsx(
                  styles.menuItem,
                  isActive("/dashboard/account") && styles.active
                )}
                title={isCollapsed ? "Account" : ""}
              >
                <i className="fa-solid fa-user-shield"></i>
                <span className={styles.menuText}>Account</span>
              </Link>
            </li>
          </>
        )}
      </ul>

      <div className={styles.footer}>
        <div className={styles.divider}></div>
        <Link
          to="/"
          className={styles.menuItem}
          title={isCollapsed ? "Back to Home" : ""}
        >
          <i className="fa-solid fa-house-chimney"></i>
          <span className={styles.menuText}>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
