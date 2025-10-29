import styles from "./Sidebar.module.scss";
import "../../../GlobalStyles/GlobalStyles.scss";
import clsx from "clsx";
import { Link, useLocation } from "react-router-dom";

import Admin from "../../../../assets/images/elements.png";

function Sidebar() {
  const location = useLocation();
  const role = localStorage.getItem("role");

  return (
    <>
      <div className={clsx("mt-36", styles.sidebar)}>
        <Link to="/dashboard/employee" className={styles.sidebarTitle}>
          <img src={Admin} alt="" className={styles.sidebarIcon} />
          <span className={styles.sidebarText}>Admin dashboard</span>
        </Link>

        <ul className={styles.sidebarMenu}>
          {role === "admin" && (
            <li>
              <Link
                to="/dashboard/employee"
                className={clsx(
                  styles.sidebarItem,
                  location.pathname === "/dashboard/employee" && styles.active
                )}
              >
                <span className={styles.sidebarText}>Employee</span>
              </Link>
            </li>
          )}
          <li>
            <Link
              to="/dashboard/products"
              className={clsx(
                styles.sidebarItem,
                location.pathname === "/dashboard/products" && styles.active
              )}
            >
              <span className={styles.sidebarText}>Products</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/customers"
              className={clsx(
                styles.sidebarItem,
                location.pathname === "/dashboard/customers" && styles.active
              )}
            >
              <span className={styles.sidebarText}>Customers</span>
            </Link>
          </li>
          <li>
            <Link
              to="/dashboard/orders"
              className={clsx(
                styles.sidebarItem,
                location.pathname === "/dashboard/orders" && styles.active
              )}
            >
              <span className={styles.sidebarText}>Orders</span>
            </Link>
          </li>

          {role === "admin" && (
            <li>
              <Link
                to="/dashboard/account"
                className={clsx(
                  styles.sidebarItem,
                  location.pathname === "/dashboard/account" && styles.active
                )}
              >
                <span className={styles.sidebarText}>Account</span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
