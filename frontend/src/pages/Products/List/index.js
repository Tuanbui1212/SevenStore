import styles from "./ListProduct.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import no_item from "../../../assets/images/no_img.jpg";

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [countDelete, setCountDelete] = useState(0);
  const [deleteId, setDeleteId] = useState(null);

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const pageSize = 5; // số dòng mỗi trang

  const navigate = useNavigate();

  // Lấy dữ liệu
  const fetchProducts = () => {
    fetch("http://localhost:5000/dashboard/products")
      .then((res) => res.json())
      .then((data) => {
        const newList = data.listProduct.map((product) => {
          const total = Object.values(product.size).reduce(
            (sum, value) => Number(sum) + Number(value),
            0
          );

          return { ...product, total };
        });
        setCountDelete(data.deletedCount);
        setProducts(newList);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  //Xóa mềm
  const handleDeleteSoft = () => {
    if (!deleteId) return;

    fetch(`http://localhost:5000/dashboard/products/${deleteId}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        alert("✅ Deleted successfully!");
        fetchProducts();
      })
      .catch(() => alert("❌ An error occurred while deleting!"))
      .finally(() => {
        setDeleteId(null);
        setShowModal(false);
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
        <div>
          <button
            className={styles.searchButton}
            style={{ display: countDelete === 0 ? "none" : "inline-block" }}
            onClick={() => navigate("/dashboard/products/trash")}
          >
            <i className="fa-solid fa-trash"></i>
            Trash ({countDelete})
          </button>
          <button
            className={styles.searchButton}
            onClick={() => navigate("/dashboard/products/create")}
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
            <th className={styles.tableHeader}>Image</th>
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
              <td className={styles.tableCell}>
                <img src={product.image.image1 || no_item} alt="" />
              </td>
              <td className={styles.tableCell}>{product.total}</td>
              <td
                className={clsx(
                  styles.tableCell,
                  styles.tableStatus,
                  product.total === 0 && styles.out,
                  product.total > 0 &&
                    product.status === "null" &&
                    styles.available,
                  product.total > 0 &&
                    product.status === "BestSeller" &&
                    styles.bestseller,
                  product.total > 0 && product.status === "New" && styles.new,
                  product.total > 0 && product.status === "Sale" && styles.sale
                )}
              >
                {product.total > 0
                  ? product.status === "null"
                    ? "Available"
                    : product.status
                  : "Out of Stock"}
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
                    navigate(`/dashboard/products/${product._id}`);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  onClick={() => {
                    setShowModal(true);
                    setDeleteId(product._id);
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
            <button onClick={handleDeleteSoft}>Có</button>
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

export default Products;
