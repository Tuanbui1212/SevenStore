import styles from "./Order.module.scss";
import clsx from "clsx";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../../util/axios";
import { useModal } from "../../contexts/ModalContext";

const PAGE_SIZE = 10;

const STATUS_COLORS = {
  Pending: "statusPending",
  Confirmed: "statusConfirmed",
  Shipping: "statusShipping",
  Delivered: "statusDelivered",
  Cancelled: "statusCancelled",
};

const ACTIVE_TABS = [
  { key: "", label: "All Active", tone: "toneAll", countKey: "All" },
  { key: "Pending", label: "Pending", tone: "tonePending", countKey: "Pending" },
  { key: "Confirmed", label: "Confirmed", tone: "toneConfirmed", countKey: "Confirmed" },
  { key: "Shipping", label: "Shipping", tone: "toneShipping", countKey: "Shipping" },
];

const HISTORY_TABS = [
  { key: "", label: "All History", tone: "toneAll", countKey: "All" },
  { key: "Delivered", label: "Delivered", tone: "toneDelivered", countKey: "Delivered" },
  { key: "Cancelled", label: "Cancelled", tone: "toneCancelled", countKey: "Cancelled" },
];

function Order() {
  const [orders, setOrders] = useState([]);
  const { type } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusCounts, setStatusCounts] = useState({ All: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [refreshKey, setRefreshKey] = useState(0);

  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setSearchTerm("");
    setStatusFilter("");
    setCurrentPage(1);
  }, [type]);

  useEffect(() => {
    setIsLoading(true);
    const params = new URLSearchParams({ page: currentPage, limit: PAGE_SIZE });
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter) params.set("status", statusFilter);
    if (sortConfig.key) {
      params.set("sortKey", sortConfig.key);
      params.set("sortDir", sortConfig.direction);
    }
    axios
      .get(`/dashboard/orders/manage/${type}?${params}`)
      .then((res) => {
        setOrders(res.data.orders || []);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.statusCounts) setStatusCounts(res.data.statusCounts);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, [type, currentPage, searchTerm, statusFilter, sortConfig, refreshKey]);

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

  const handleUpdateStatus = useCallback(
    (id, newStatus) => {
      axios
        .put(`/dashboard/orders/${id}`, { status: newStatus })
        .then(() => {
          showModal({
            title: "Success",
            message: `Updated order status to: ${newStatus}`,
            type: "success",
          });
          setRefreshKey((k) => k + 1);
        })
        .catch((err) => console.error(err));
    },
    [showModal]
  );

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
        ? "Completed and cancelled customer orders"
        : "Track, confirm, and dispatch active orders in real time",
    [type]
  );

  const tabs = type === "history" ? HISTORY_TABS : ACTIVE_TABS;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>{pageTitle}</h2>
          <p className={styles.pageDesc}>{pageDesc}</p>
        </div>
      </div>

      {/* Color-coded Status Filter Pills */}
      <div className={styles.statusFilterBar}>
        {tabs.map((tab) => {
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
            placeholder="Search by customer name, phone, city..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      {isLoading ? (
        <div style={{ textAlign: "center", padding: "40px", fontSize: "1.5rem", color: "#6b7280" }}>
          Loading orders...
        </div>
      ) : (
        <>
          <div className={styles.tableResponsive}>
            <table className={styles.table}>
              <thead className={styles.tableTitle}>
                <tr>
                  <th className={styles.tableHeader}>Order ID</th>
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
                    <tr key={e._id || index} className={styles.tableRow}>
                      <td className={clsx(styles.tableCell, styles.idCell)}>
                        #{e._id.slice(-6).toUpperCase()}
                      </td>
                      <td className={clsx(styles.tableCell, styles.dateCell)}>
                        {formatDate(e.createdAt)}
                      </td>
                      <td className={styles.tableCell}>
                        <strong>{e.name}</strong>
                        <div className={styles.subText}>{e.city}</div>
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
                          <span className={styles.statusDot} />
                          {e.status || "Pending"}
                        </span>
                      </td>
                      <td className={styles.tableCell}>
                        <div className={styles.actionButtons}>
                          {type !== "history" && (
                            <>
                              {(e.status === "Pending" || !e.status) && (
                                <button
                                  type="button"
                                  title="Confirm Order"
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
                                  type="button"
                                  title="Dispatch / Start Shipping"
                                  className={styles.btnShip}
                                  onClick={() =>
                                    handleUpdateStatus(e._id, "Shipping")
                                  }
                                >
                                  <i className="fa-solid fa-truck-fast"></i>
                                </button>
                              )}
                              {e.status === "Shipping" && (
                                <button
                                  type="button"
                                  title="Mark Delivered"
                                  className={styles.btnDeliver}
                                  onClick={() =>
                                    handleUpdateStatus(e._id, "Delivered")
                                  }
                                >
                                  <i className="fa-solid fa-box-check fa-solid fa-circle-check"></i>
                                </button>
                              )}
                            </>
                          )}
                          <button
                            type="button"
                            title="View Details"
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
                        padding: "48px 20px",
                        color: "#888",
                        fontSize: "1.5rem",
                      }}
                    >
                      <i
                        className="fa-solid fa-inbox"
                        style={{
                          fontSize: "2.6rem",
                          marginBottom: "10px",
                          display: "block",
                          color: "#d1d5db",
                        }}
                      ></i>
                      No orders found
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
        </>
      )}
    </div>
  );
}

export default Order;
