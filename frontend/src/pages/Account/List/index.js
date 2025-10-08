import styles from "./Account.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Account() {
  const [account, setAccount] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // số dòng mỗi trang

  const navigate = useNavigate();

  const fetchAccount = () => {
    fetch("http://localhost:5000/dashboard/account")
      .then((res) => res.json())
      .then((data) => {
        setAccount(data.account);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchAccount();
  }, []);

  // Tính toán phân trang
  const totalPages = Math.ceil(account.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = account.slice(startIndex, startIndex + pageSize);

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
        <div>
          <button
            className={styles.searchButton}
            onClick={() => navigate("/dashboard/account/create")}
          >
            ADD
          </button>
        </div>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableTitle}>
          <tr>
            <th className={styles.tableHeader}>#</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>User</th>
            <th className={styles.tableHeader}>Password</th>
            <th className={styles.tableHeader}>Role</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((a, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{a.name}</td>
              <td className={styles.tableCell}>{a.user}</td>
              <td className={styles.tableCell}>{a.password}</td>
              <td
                className={clsx(
                  styles.tableCell,
                  styles.tableStatus,
                  a.role === "staff" && styles.staff,
                  a.role === "customer" && styles.customer
                )}
              >
                {a.role}
              </td>

              <td className={styles.tableCell}>
                <button
                  onClick={() => {
                    navigate(`/dashboard/account/${a._id}`);
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
    </div>
  );
}

export default Account;
