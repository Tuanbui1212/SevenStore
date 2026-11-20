import styles from "./Customer.module.scss";
import clsx from "clsx";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";
import { useModal } from "../../../contexts/ModalContext";

const PAGE_SIZE = 10;

const CUSTOMER_TABS = [
  { key: "", label: "All Customers", tone: "toneAll", countKey: "All" },
  { key: "Active", label: "Active", tone: "toneActive", countKey: "Active" },
  { key: "Inactive", label: "Inactive", tone: "toneInactive", countKey: "Inactive" },
];

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusCounts, setStatusCounts] = useState({ All: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const { showModal, confirmModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({ page: currentPage, limit: PAGE_SIZE });
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter) params.set("status", statusFilter);
    axios
      .get(`/dashboard/customers?${params}`)
      .then((res) => {
        setCustomer(res.data.customers || []);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.statusCounts) setStatusCounts(res.data.statusCounts);
      })
      .catch((err) => console.error(err));
  }, [currentPage, searchTerm, statusFilter]);

  const handleDelete = useCallback(() => {
    showModal({
      title: "Success",
      message: "Deleted successfully",
      type: "success",
    });
  }, [showModal]);

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
          <h2 className={styles.pageTitle}>Customer Directory</h2>
          <p className={styles.pageDesc}>
            View and manage registered shoppers, contact info, and status
          </p>
        </div>
      </div>

      {/* Color-Coded Status Filter Pills */}
      <div className={styles.statusFilterBar}>
        {CUSTOMER_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
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
                setStatusFilter(tab.key);
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
            placeholder="Search by customer name, phone, address..."
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
                Customer {renderSortIcon("name")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("phone")}
              >
                Phone {renderSortIcon("phone")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("address")}
              >
                Address {renderSortIcon("address")}
              </th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customer.length > 0 ? (
              customer.map((cust, index) => (
                <tr key={cust._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{startIndex + index + 1}</td>
                  <td className={styles.tableCell}>
                    <strong>{cust.name}</strong>
                  </td>
                  <td className={styles.tableCell}>{cust.phone}</td>
                  <td className={clsx(styles.tableCell, styles.addressCell)}>
                    {cust.address}
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={clsx(
                        styles.tableStatus,
                        cust.status === "Inactive" ? styles.inactive : styles.active
                      )}
                    >
                      <span className={styles.statusDot} />
                      {cust.status || "Active"}
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionBtns}>
                      <button
                        type="button"
                        title="Edit Customer"
                        className={styles.editBtn}
                        onClick={() => navigate(`/dashboard/customers/${cust._id}`)}
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        title="Delete Customer"
                        className={styles.deleteBtn}
                        onClick={() => {
                          confirmModal({
                            title: "Confirm Deletion",
                            message: "Are you sure you want to delete?",
                            type: "warning",
                            confirmText: "Yes, delete",
                            onConfirm: () => handleDelete(),
                          });
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "40px", fontSize: "1.5rem", color: "#6b7280" }}>
                  No customers found
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

export default Customer;
