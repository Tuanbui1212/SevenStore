import styles from "./TrashEmployee.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";

function TrashEmployee() {
  const [employee, setEmployee] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [restoreId, setRestoreId] = useState(null);
  const [actionType, setActionType] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  const pageSize = 6;
  const navigate = useNavigate();

  const fetchEmployees = () => {
    axios
      .get("/dashboard/employee/trash")
      .then((res) => {
        const formattedEmployees = res.data.trashEmployee.map((employee) => {
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
    axios
      .patch(`/dashboard/employee/trash/${restoreId}/restore`)
      .then((res) => {
        setShowModal(false);
        fetchEmployees();
      })
      .catch(() => alert("❌ An error occurred while restoring!"))
      .finally(() => {
        setRestoreId(null);
        setActionType("");
      });
  };

  const handleDelete = () => {
    if (!deleteId) return;
    axios
      .delete(`/dashboard/employee/trash/${deleteId}`)
      .then((res) => {
        setShowModal(false);
        fetchEmployees();
      })
      .catch(() => alert("❌ An error occurred while deleting!"))
      .finally(() => {
        setDeleteId(null);
        setActionType("");
      });
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = employee.filter((e) => {
    const term = searchTerm.toLowerCase();
    return (
      e.name.toLowerCase().includes(term) || e.role.toLowerCase().includes(term)
    );
  });

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
      }
      if (typeof bValue === "string") {
        bValue = bValue.toLowerCase();
      }

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
    <div className={clsx("mt-36 container", styles.tableWrapper)}>
      <div className={styles.tableControls}>
        <input
          type="text"
          placeholder="Search by name or role..."
          className={styles.searchInput}
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
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
            <th className={styles.tableHeader}>#</th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("name")}
            >
              Name {renderSortIcon("name")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("role")}
            >
              Position {renderSortIcon("role")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("status")}
            >
              Status {renderSortIcon("status")}
            </th>
            <th
              className={clsx(styles.tableHeader, styles.sortable)}
              onClick={() => handleSort("date")}
            >
              Date {renderSortIcon("date")}
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
                      setActionType("restore");
                      setModalMessage("Are you sure you want to restore?");
                    }}
                  >
                    <i className="fa-solid fa-window-restore"></i>
                  </button>
                  <button
                    onClick={() => {
                      setShowModal(true);
                      setDeleteId(e._id);
                      setActionType("delete");
                      setModalMessage("Permanently delete this employee?");
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
                No employees found matching "{searchTerm}"
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
              onClick={actionType === "restore" ? handleRestore : handleDelete}
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
          </div>
        </div>
      )}
    </div>
  );
}

export default TrashEmployee;
