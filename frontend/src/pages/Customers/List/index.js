import styles from "./ListProduct.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";

function Customer() {
  const [customer, setCustomer] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const pageSize = 6; // số dòng mỗi trang

  const navigate = useNavigate();

  // Lấy dữ liệu
  const fetchCustomer = () => {
    // fetch("http://localhost:5000/dashboard/customers")
    //   .then((res) => res.json())
    axios
      .get("/dashboard/customers")
      .then((res) => {
        setCustomer(res.data.customers);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchCustomer();
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(customer.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = customer.slice(startIndex, startIndex + pageSize);

  // Tạo danh sách trang hiển thị (có dấu ...)
  const getPageNumbers = () => {
    const pages = [];

    if (totalPages <= 7) {
      // ít trang thì hiển thị hết
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

  return (
    <div className={clsx("mt-36", styles.tableWrapper)}>
      <div className={styles.tableControls}>
        <input
          type="text"
          placeholder="Search by name..."
          className={styles.searchInput}
        />
      </div>

      <table className={styles.table}>
        <thead className={styles.tableTitle}>
          <tr>
            <th className={styles.tableHeader}>#</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Tel</th>
            <th className={styles.tableHeader}>Address</th>
            <th className={styles.tableHeader}>MemberStatus</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((customer, index) => (
            <tr key={customer._id} className={styles.tableRow}>
              <td className={styles.tableCell}>{startIndex + index + 1}</td>
              <td className={styles.tableCell}>{customer.name}</td>
              <td className={styles.tableCell}>{customer.phone}</td>
              <td className={clsx(styles.tableCell, styles.tablePrice)}>
                {customer.address}
              </td>
              <td
                className={clsx(
                  styles.tableCell,
                  styles.tableStatus,
                  customer.total === 0 && styles.fullTime
                )}
              >
                {customer.total > 0 ? "Available" : "Out of Stock"}
              </td>

              <td className={styles.tableCell}>
                <button
                  onClick={() => {
                    navigate(`/dashboard/customers/${customer._id}`);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Thanh phân trang */}
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

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button>Có</button>
            <button
              onClick={() => {
                setShowModal(false);
              }}
            >
              Không
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customer;
