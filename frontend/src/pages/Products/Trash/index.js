import styles from "./TrashProduct.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [restoreId, setRestoreId] = useState("");
  const [deleteId, setDeleteId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const pageSize = 6; // số dòng mỗi trang

  const navigate = useNavigate();

  const fetchProducts = () => {
    // fetch("http://localhost:5000/dashboard/products/trash")
    //   .then((res) => res.json())
    axios
      .get("/dashboard/products/trash")
      .then((res) => {
        const newList = res.data.trashProducts.map((product) => {
          const total = Object.values(product.size).reduce(
            (sum, value) => sum + value,
            0
          );

          return { ...product, total };
        });

        setProducts(newList);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //Xóa that
  const handleDelete = () => {
    if (!deleteId) return;

    // fetch(`http://localhost:5000/dashboard/products/${deleteId}/force`, {
    //   method: "DELETE",
    // })
    //   .then((res) => res.json())
    axios
      .delete(`/dashboard/products/${deleteId}/force`)
      .then((res) => {
        setModalMessage(res.data.message);
        setShowModal(true);
        fetchProducts();
      })
      .catch(() => alert("❌ Có lỗi xảy ra khi xóa!"))
      .finally(() => {
        setDeleteId(null);
      });
  };

  const handleRestore = () => {
    if (!restoreId) return;

    // fetch(`http://localhost:5000/dashboard/products/${restoreId}/restore`, {
    //   method: "PATCH",
    // })
    //   .then((res) => res.json())
    axios
      .patch(`/dashboard/products/${restoreId}/restore`)
      .then((res) => {
        setModalMessage(res.data.message);
        setShowModal(true);
        fetchProducts();
      })
      .catch(() => alert("❌ Có lỗi xảy ra khi khôi phục!"))
      .finally(() => {
        setDeleteId(null);
      });
  };

  // Tính toán phân trang
  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentData = products.slice(startIndex, startIndex + pageSize);

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
          onClick={() => navigate("/dashboard/products")}
        >
          BACK
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableTitle}>
          <tr>
            <th className={styles.tableHeader}>#</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Quantity</th>
            <th className={styles.tableHeader}>Status</th>
            <th className={styles.tableHeader}>Brand</th>
            <th className={styles.tableHeader}>Price</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((product, index) => (
            <tr key={product._id} className={styles.tableRow}>
              <td className={styles.tableCell}>{startIndex + index + 1}</td>
              <td className={styles.tableCell}>{product.name}</td>
              <td className={styles.tableCell}>{product.total}</td>
              <td
                className={clsx(
                  styles.tableCell,
                  styles.tableStatus,
                  product.total === 0 && styles.fullTime
                )}
              >
                {product.total > 0 ? "Available" : "Out of Stock"}
              </td>

              <td className={clsx(styles.tableCell, styles.tableBrand)}>
                {product.brand}
              </td>
              <td className={clsx(styles.tableCell, styles.tablePrice)}>
                {Number(product.cost).toLocaleString("vi-VN")} đ
              </td>
              <td className={styles.tableCell}>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setRestoreId(product._id);
                    setModalMessage("Are you sure you want to restore?");
                  }}
                >
                  <i className="fa-solid fa-window-restore"></i>
                </button>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setDeleteId(product._id);
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
            {modalMessage.includes("successfully") ? (
              <button
                onClick={() => {
                  setShowModal(false);
                }}
              >
                Close
              </button>
            ) : (
              <>
                <button
                  onClick={
                    modalMessage.includes("restore")
                      ? handleRestore
                      : modalMessage.includes("delete")
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
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Products;
