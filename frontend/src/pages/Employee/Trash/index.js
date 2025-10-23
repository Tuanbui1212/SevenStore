import styles from "./TrashEmployee.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TrashEmployee() {
  const [employee, setEmployee] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [restoreId, setRestoreId] = useState(null);
  const pageSize = 6; // số dòng mỗi trang

  const navigate = useNavigate();

  const fetchEmployees = () => {
    fetch("http://localhost:5000/dashboard/employee/trash")
      .then((res) => res.json())
      .then((data) => {
        const formattedEmployees = data.trashEmpolyee.map((employee) => {
          if (!employee.date) {
            return employee;
          }

          const formattedDate = new Date(employee.date)
            .toISOString()
            .split("T")[0];

          return {
            ...employee,
            date: formattedDate,
          };
        });

        setEmployee(formattedEmployees);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleRestore = () => {
    if (!restoreId) return;

    fetch(
      `http://localhost:5000/dashboard/employee/trash/${restoreId}/restore`,
      {
        method: "PATCH",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setModalMessage(data.message);
        setShowModal(true);
        fetchEmployees();
      })
      .catch(() => alert("❌ An error occurred while restoring!"))
      .finally(() => {
        setDeleteId(null);
        setShowModal(false);
      });
  };

  const handleDelete = () => {
    if (!deleteId) return;

    fetch(`http://localhost:5000/dashboard/employee/trash/${deleteId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        setModalMessage(data.message);
        setShowModal(true);
        fetchEmployees();
      })
      .catch(() => alert("❌ An error occurred while deleting!"))
      .finally(() => {
        setDeleteId(null);
        setShowModal(false);
      });
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(employee.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = employee.slice(startIndex, startIndex + pageSize);

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
        <button
          className={styles.searchButton}
          onClick={() => navigate("/dashboard/employee")}
        >
          BACK
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableTitle}>
          <tr>
            <th className={styles.tableHeader}>ID</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Role</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Date</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((e, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
              <td className={styles.tableCell}>{e.name}</td>
              <td className={styles.tableCell}>{e.role}</td>
              <td
                className={clsx(
                  styles.tableCell,
                  styles.tableStatus,
                  e.status === "Full-Time" && styles.fullTime,
                  e.status === "Part-Time" && styles.partTime
                )}
              >
                {e.status}
              </td>

              <td className={styles.tableCell}>{e.date}</td>
              <td className={styles.tableCell}>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setRestoreId(e._id);
                    setModalMessage("Are you sure you want to restore?");
                  }}
                >
                  <i className="fa-solid fa-window-restore"></i>
                </button>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setDeleteId(e._id);
                    setModalMessage("Are you sure you want to delete?");
                  }}
                >
                  <i className="fa-solid fa-trash"></i>
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

            {modalMessage.includes("Are you sure you want to restore?") ||
            modalMessage.includes("Are you sure you want to delete?") ? (
              <>
                <button
                  onClick={
                    modalMessage.includes("Are you sure you want to restore?")
                      ? handleRestore
                      : modalMessage.includes(
                          "Are you sure you want to delete?"
                        )
                      ? handleDelete
                      : () => {}
                  }
                >
                  Yes
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  No
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Close
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrashEmployee;
