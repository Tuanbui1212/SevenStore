import styles from "./Order.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../util/axios";

function Order() {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const pageSize = 5;
  const navigate = useNavigate();

  const fetchOrder = () => {
    axios
      .get("/dashboard/orders")
      .then((res) => {
        setOrders(res.data.order);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = orders.filter((order) => {
    const term = searchTerm.toLowerCase();
    return (
      (order.name && order.name.toLowerCase().includes(term)) ||
      (order.phone && order.phone.includes(term)) ||
      (order.city && order.city.toLowerCase().includes(term))
    );
  });

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      let aValue = a[sortConfig.key]
        ? a[sortConfig.key].toString().toLowerCase()
        : "";
      let bValue = b[sortConfig.key]
        ? b[sortConfig.key].toString().toLowerCase()
        : "";

      if (aValue < bValue) {
        return sortConfig.direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return sortConfig.direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = filteredData.slice(startIndex, startIndex + pageSize);

  const getPageNumbers = () => {
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
  };

  const renderSortIcon = (columnKey) => {
    if (sortConfig.key !== columnKey) {
      return (
        <i
          className="fa-solid fa-sort"
          style={{ fontSize: "12px", marginLeft: "5px", opacity: 0.3 }}
        ></i>
      );
    }
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
  };

  return (
    <div className={clsx("mt-36", styles.tableWrapper)}>
      <div className={styles.tableControls}>
        <input
          type="text"
          placeholder="Search by name, phone, city..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <table className={styles.table}>
        <thead className={styles.tableTitle}>
          <tr>
            <th className={styles.tableHeader}>#</th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("name")}
            >
              Name {renderSortIcon("name")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("phone")}
            >
              Phone {renderSortIcon("phone")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("city")}
            >
              City {renderSortIcon("city")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("paymentMethod")}
            >
              Status {renderSortIcon("paymentMethod")}
            </th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((e, index) => (
              <tr key={index} className={styles.tableRow}>
                <td className={styles.tableCell}>{startIndex + index + 1}</td>
                <td className={styles.tableCell}>
                  <strong>{e.name}</strong>
                </td>
                <td className={styles.tableCell}>{e.phone}</td>
                <td className={styles.tableCell}>{e.city}</td>
                <td className={styles.tableCell}>
                  <span
                    className={clsx(
                      styles.tableStatus,
                      e.paymentMethod === "Momo" && styles.Momo,
                      e.paymentMethod === "VnPay" && styles.VnPay,
                      e.paymentMethod === "ShipCod" && styles.ShipCOD
                    )}
                  >
                    {e.paymentMethod}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <button
                    onClick={() => {
                      navigate(`/dashboard/orders/${e._id}`);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No orders found matching "{searchTerm}"
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

          {getPageNumbers().map((p, i) =>
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

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;
