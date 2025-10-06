import styles from "./Employee.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Employee() {
  const [employee, setEmployee] = useState([]);

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  
  const [deleteId, setDeleteId] = useState(null);
  const [countDelete, setCountDelete] = useState(0);
  
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // số dòng mỗi trang

  const navigate = useNavigate();

  const fetchEmployees = () => {
    fetch("http://localhost:5000/dashboard/employee")
      .then((res) => res.json())
      .then((data) => {
        const formattedEmployees = data.employees.map((employee) => {
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
        setCountDelete(data.deletedCount);
        setEmployee(formattedEmployees);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleDelete = () => {
    if (!deleteId) return;

    fetch(`http://localhost:5000/dashboard/employee/${deleteId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Xóa thành công!");
        fetchEmployees(); // load lại danh sách
      })
      .catch(() => alert("❌ Có lỗi xảy ra khi xóa!"))
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
        <div>
          <button
            className={styles.searchButton}
            style={{ display: countDelete === 0 ? "none" : "inline-block" }}
            onClick={() => navigate("/dashboard/employee/trash")}
          >
            <i className="fa-solid fa-trash"></i>
            Trash ({countDelete})
          </button>
          <button
            className={styles.searchButton}
            onClick={() => navigate("/dashboard/employee/create")}
          >
            ADD
          </button>
        </div>
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
                    navigate(`/dashboard/employee/${e._id}`);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setDeleteId(e._id);
                    setModalMessage("Bạn có chắc chắn muốn xóa không ?");
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
            <button onClick={handleDelete}>Có</button>
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

export default Employee;
