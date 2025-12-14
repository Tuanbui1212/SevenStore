import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import clsx from "clsx";
import styles from "./Sidebar.module.scss";
import "../../../GlobalStyles/GlobalStyles.scss";
import AdminLogo from "../../../../assets/images/elements.png"; // Đảm bảo đường dẫn đúng

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role"); // Lấy quyền từ localStorage
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isActive = (path) => location.pathname.includes(path);

  return (
    <div className={clsx(styles.sidebar, isCollapsed && styles.collapsed)}>
      {/* --- NÚT TOGGLE (ĐÓNG/MỞ) --- */}
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

      {/* --- HEADER (LOGO) --- */}
      <div className={styles.header}>
        <img src={AdminLogo} alt="Logo" className={styles.logo} />
        <div className={styles.brandInfo}>
          <span className={styles.brandTitle}>Admin Panel</span>
          <span className={styles.brandSubtitle}>System Manager</span>
        </div>
      </div>

      {/* --- MENU LIST --- */}
      <ul className={styles.menuList}>
        {/* Chỉ Admin mới thấy Employee */}
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

        <li>
          <Link
            to="/dashboard/orders"
            className={clsx(
              styles.menuItem,
              isActive("/dashboard/orders") && styles.active
            )}
            title={isCollapsed ? "Orders" : ""}
          >
            <i className="fa-solid fa-cart-shopping"></i>
            <span className={styles.menuText}>Orders</span>
          </Link>
        </li>

        {/* Chỉ Admin mới thấy Account */}
        {role === "admin" && (
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
        )}
        {role === "admin" && (
          <li>
            <Link
              to="/dashboard/report"
              className={clsx(
                styles.menuItem,
                isActive("/dashboard/report") && styles.active
              )}
              title={isCollapsed ? "Statistical Report" : ""}
            >
              <i className="fa-solid fa-chart-line"></i>
              <span className={styles.menuText}>Report</span>
            </Link>
          </li>
        )}
      </ul>

      {/* --- FOOTER (BACK HOME) --- */}
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
