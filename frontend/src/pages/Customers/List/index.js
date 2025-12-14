import styles from "./Customer.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [deleteId, setDeleteId] = useState(null);

  const pageSize = 5;
  const navigate = useNavigate();

  const fetchCustomer = () => {
    axios
      .get("/dashboard/customers")
      .then((res) => {
        // Giả sử API trả về mảng customers
        setCustomer(res.data.customers);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  const handleDelete = () => {
    // Xử lý logic xóa ở đây (gọi API xóa)
    // Sau khi xóa thành công:
    // setCustomer(prev => prev.filter(c => c._id !== deleteId));
    setShowModal(false);
    setModalMessage("Deleted successfully (Demo logic)");
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Logic Search & Sort kết hợp
  const filteredData = customer.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      (c.name && c.name.toLowerCase().includes(term)) ||
      (c.phone && c.phone.includes(term)) ||
      (c.address && c.address.toLowerCase().includes(term))
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
          placeholder="Search by name, phone, address..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        {/* Nút Add nếu cần, để đồng bộ layout */}
        {/* <button className={styles.searchButton} onClick={() => navigate("/dashboard/customers/create")}> ADD </button> */}
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
              Tel {renderSortIcon("phone")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("address")}
            >
              Address {renderSortIcon("address")}
            </th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.length > 0 ? (
            currentData.map((cust, index) => (
              <tr key={cust._id} className={styles.tableRow}>
                <td className={styles.tableCell}>{startIndex + index + 1}</td>
                <td className={styles.tableCell}>
                  <strong>{cust.name}</strong>
                </td>
                <td className={styles.tableCell}>{cust.phone}</td>
                <td className={styles.tableCell}>{cust.address}</td>
                <td className={styles.tableCell}>
                  <span
                    className={clsx(
                      styles.tableStatus,
                      // Logic màu sắc demo, bạn sửa lại theo data thật
                      cust.status === "Inactive"
                        ? styles.inactive
                        : styles.active
                    )}
                  >
                    {cust.status || "Active"}
                  </span>
                </td>
                <td className={styles.tableCell}>
                  <button
                    onClick={() => {
                      navigate(`/dashboard/customers/${cust._id}`);
                    }}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    onClick={() => {
                      setDeleteId(cust._id);
                      setModalMessage("Are you sure you want to delete?");
                      setShowModal(true);
                    }}
                  >
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                No customers found matching "{searchTerm}"
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
            <button onClick={handleDelete}>Yes</button>
            <button
              onClick={() => {
                setShowModal(false);
              }}
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;
