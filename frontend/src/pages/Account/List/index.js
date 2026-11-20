import styles from "./Account.module.scss";
import clsx from "clsx";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";

const PAGE_SIZE = 10;

const ROLE_TABS = [
  { key: "", label: "All Accounts", tone: "toneAll", countKey: "All" },
  { key: "admin", label: "Admins", tone: "toneAdmin", countKey: "admin" },
  { key: "staff", label: "Staff", tone: "toneStaff", countKey: "staff" },
  { key: "customer", label: "Customers", tone: "toneCustomer", countKey: "customer" },
];

function Account() {
  const [account, setAccount] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusCounts, setStatusCounts] = useState({ All: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const navigate = useNavigate();

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams({ page: currentPage, limit: PAGE_SIZE });
    if (searchTerm) params.set("search", searchTerm);
    if (roleFilter) params.set("role", roleFilter);
    if (sortConfig.key) {
      params.set("sortKey", sortConfig.key);
      params.set("sortDir", sortConfig.direction);
    }
    axios
      .get(`/dashboard/account?${params}`)
      .then((res) => {
        setAccount(res.data.account || []);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.statusCounts) setStatusCounts(res.data.statusCounts);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [currentPage, searchTerm, roleFilter, sortConfig]);

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const pageNumbers = useMemo(() => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 4) pages.push("...");
      for (let i = currentPage - 2; i <= currentPage + 2; i++) {
        if (i > 1 && i < totalPages) pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  }, [totalPages, currentPage]);

  const renderSortIcon = useCallback(
    (columnKey) => {
      if (sortConfig.key !== columnKey)
        return (
          <i
            className="fa-solid fa-sort"
            style={{ fontSize: "12px", marginLeft: "5px", opacity: 0.3 }}
          ></i>
        );
      return sortConfig.direction === "asc" ? (
        <i
          className="fa-solid fa-sort-up"
          style={{ fontSize: "12px", marginLeft: "5px" }}
        ></i>
      ) : (
        <i
          className="fa-solid fa-sort-down"
          style={{ fontSize: "12px", marginLeft: "5px" }}
        ></i>
      );
    },
    [sortConfig]
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Accounts & Permissions</h2>
          <p className={styles.pageDesc}>
            Manage system accounts, access roles, and staff credentials
          </p>
        </div>
        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.addButton}
            onClick={() => navigate("/dashboard/account/create")}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Color-Coded Role Filter Pills */}
      <div className={styles.statusFilterBar}>
        {ROLE_TABS.map((tab) => {
          const isActive = roleFilter === tab.key;
          const count = statusCounts[tab.countKey] ?? 0;
          return (
            <button
              key={tab.key || "all"}
              type="button"
              className={clsx(
                styles.statusFilterPill,
                styles[tab.tone],
                isActive && styles.pillActive
              )}
              onClick={() => {
                setRoleFilter(tab.key);
                setCurrentPage(1);
              }}
            >
              <span className={styles.pillDot} />
              <span>{tab.label}</span>
              <span className={styles.pillCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by full name or username..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead className={styles.tableTitle}>
            <tr>
              <th className={styles.tableHeader}>#</th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("name")}
              >
                Full Name {renderSortIcon("name")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("user")}
              >
                Username {renderSortIcon("user")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("role")}
              >
                Role {renderSortIcon("role")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("createdAt")}
              >
                Joined {renderSortIcon("createdAt")}
              </th>
            </tr>
          </thead>
          <tbody>
            {account.length > 0 ? (
              account.map((a, index) => (
                <tr key={a._id || index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{startIndex + index + 1}</td>
                  <td className={styles.tableCell}>
                    <strong>{a.name}</strong>
                  </td>
                  <td className={styles.tableCell}>{a.user}</td>
                  <td className={styles.tableCell}>
                    <span
                      className={clsx(
                        styles.tableStatus,
                        a.role === "staff" && styles.staff,
                        a.role === "customer" && styles.customer,
                        a.role === "admin" && styles.admin
                      )}
                    >
                      <span className={styles.statusDot} />
                      {a.role}
                    </span>
                  </td>
                  <td className={styles.tableCell}>{formatDate(a.createdAt)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: "center", padding: "40px", fontSize: "1.5rem", color: "#6b7280" }}>
                  No accounts found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <i className="fa-solid fa-caret-left"></i>
          </button>
          {pageNumbers.map((p, i) =>
            p === "..." ? (
              <span key={i} className={styles.ellipsis}>
                ...
              </span>
            ) : (
              <button
                key={i}
                className={clsx(currentPage === p && styles.activePage)}
                onClick={() => setCurrentPage(p)}
              >
                {p}
              </button>
            )
          )}
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            <i className="fa-solid fa-caret-right"></i>
          </button>
        </div>
      )}
    </div>
  );
}

export default Account;
