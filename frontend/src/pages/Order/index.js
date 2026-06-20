import styles from "./Order.module.scss";
import clsx from "clsx";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../util/axios";

const PAGE_SIZE = 10;

const STATUS_COLORS = {
  Pending: "statusPending",
  Confirmed: "statusConfirmed",
  Shipping: "statusShipping",
  Delivered: "statusDelivered",
  Cancelled: "statusCancelled",
};

function Order() {
  const [orders, setOrders] = useState([]);
  const { type } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm("");
    setCurrentPage(1);
  }, [type]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: currentPage, limit: PAGE_SIZE });
    if (searchTerm) params.set("search", searchTerm);
    if (sortConfig.key) {
      params.set("sortKey", sortConfig.key);
      params.set("sortDir", sortConfig.direction);
    }
    axios
      .get(`/dashboard/orders/manage/${type}?${params}`)
      .then((res) => {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [type, currentPage, searchTerm, sortConfig]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return "--";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(date);
  }, []);

  const handleUpdateStatus = useCallback((id, newStatus) => {
    axios
      .put(`/dashboard/orders/${id}`, { status: newStatus })
      .then(() => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === id ? { ...order, status: newStatus } : order
          )
        );
        setModalMessage(`Updated status to: ${newStatus}`);
        setShowModal(true);
      })
      .catch((err) => console.error(err));
  }, []);

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

  const pageTitle = useMemo(
    () => (type === "history" ? "Order History" : "Active Orders"),
    [type]
  );
  const pageDesc = useMemo(
    () =>
      type === "history"
        ? "List of delivered and cancelled orders"
        : "Manage new and shipping orders",
    [type]
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className={clsx("mt-36", styles.tableWrapper)}>
      <div className={styles.pageHeader}>
        <h2 className={styles.pageTitle}>{pageTitle}</h2>
        <p className={styles.pageDesc}>{pageDesc}</p>
      </div>

      <div className={styles.tableControls}>
        <input
          type="text"
          placeholder="Search by ID, name, phone..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px" }}>
          Loading data...
        </div>
      ) : (
        <>
          <table className={styles.table}>
            <thead className={styles.tableTitle}>
              <tr>
                <th className={styles.tableHeader}>ID</th>
                <th
                  className={clsx(styles.tableHeader, styles.sortable)}
                  onClick={() => handleSort("createdAt")}
                >
                  Date {renderSortIcon("createdAt")}
                </th>
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
                  onClick={() => handleSort("paymentMethod")}
                >
                  Payment {renderSortIcon("paymentMethod")}
                </th>
                <th
                  className={clsx(styles.tableHeader, styles.sortable)}
                  onClick={() => handleSort("status")}
                >
                  Status {renderSortIcon("status")}
                </th>
                <th className={styles.tableHeader}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((e, index) => (
                  <tr key={index} className={styles.tableRow}>
                    <td className={styles.tableCell}>
                      #{e._id.slice(-6).toUpperCase()}
                    </td>
                    <td
                      className={clsx(styles.tableCell)}
                      style={{ fontSize: "1.4em", color: "#555" }}
                    >
                      {formatDate(e.createdAt)}
                    </td>
                    <td className={styles.tableCell}>
                      <strong>{e.name}</strong>
                      <div style={{ fontSize: "0.85em", color: "#888" }}>
                        {e.city}
                      </div>
                    </td>
                    <td className={styles.tableCell}>{e.phone}</td>
                    <td className={styles.tableCell}>
                      <span
                        className={clsx(
                          styles.paymentBadge,
                          styles[e.paymentMethod]
                        )}
                      >
                        {e.paymentMethod}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <span
                        className={clsx(
                          styles.statusBadge,
                          styles[STATUS_COLORS[e.status || "Pending"]]
                        )}
                      >
                        {e.status || "Pending"}
                      </span>
                    </td>
                    <td className={styles.tableCell}>
                      <div className={styles.actionButtons}>
                        {type !== "history" && (
                          <>
                            {(e.status === "Pending" || !e.status) && (
                              <button
                                className={styles.btnConfirm}
                                onClick={() =>
                                  handleUpdateStatus(e._id, "Confirmed")
                                }
                              >
                                <i className="fa-solid fa-check"></i>
                              </button>
                            )}
                            {e.status === "Confirmed" && (
                              <button
                                className={styles.btnShip}
                                onClick={() =>
                                  handleUpdateStatus(e._id, "Shipping")
                                }
                              >
                                <i className="fa-solid fa-truck-fast"></i>
                              </button>
                            )}
                          </>
                        )}
                        <button
                          className={styles.btnDetail}
                          onClick={() =>
                            navigate(`/dashboard/orders/${e._id}`)
                          }
                        >
                          <i className="fa-solid fa-eye"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "40px",
                      color: "#888",
                    }}
                  >
                    <i
                      className="fa-solid fa-inbox"
                      style={{
                        fontSize: "2rem",
                        marginBottom: "10px",
                        display: "block",
                      }}
                    ></i>
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>

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
        </>
      )}

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <i
              className="fa-solid fa-circle-check"
              style={{
                color: "#28a745",
                fontSize: "2rem",
                marginBottom: "10px",
              }}
            ></i>
            <p>{modalMessage}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
