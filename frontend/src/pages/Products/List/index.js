import styles from "./ListProduct.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Products() {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // số dòng mỗi trang

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/dashboard/products")
      .then((res) => res.json())
      .then((data) => {
        const newList = data.listProduct.map((product) => {
          const total = Object.values(product.size).reduce(
            (sum, value) => sum + value,
            0
          );

          return { ...product, total };
        });
        setProducts(newList);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, []);

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
          onClick={() => navigate("/dashboard/products/create")}
        >
          ADD
        </button>
      </div>

      <table className={styles.table}>
        <thead className={styles.tableTitle}>
          <tr>
            <th className={styles.tableHeader}>STT</th>
            <th className={styles.tableHeader}>Name</th>
            <th className={styles.tableHeader}>Unit</th>
            <th className={styles.tableHeader}>Quantity</th>
            <th className={styles.tableHeader}>Brand</th>
            <th className={styles.tableHeader}>Price</th>
            <th className={styles.tableHeader}></th>
          </tr>
        </thead>
        <tbody>
          {currentData.map((product, index) => (
            <tr key={index} className={styles.tableRow}>
              <td className={styles.tableCell}>{index + 1}</td>
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
              <td className={clsx(styles.tableCell, styles.tableBrand)}>
                {Number(product.cost).toLocaleString("vi-VN")}
              </td>
              <td className={styles.tableCell}>
                <button
                  onClick={() => {
                    navigate(`/dashboard/products/${product._id}`);
                  }}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button>
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
    </div>
  );
}

export default Products;
