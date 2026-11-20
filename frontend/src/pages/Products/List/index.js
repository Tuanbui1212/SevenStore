import styles from "./ListProduct.module.scss";
import clsx from "clsx";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../../util/axios";
import { useModal } from "../../../contexts/ModalContext";
import no_item from "../../../assets/images/no_img.jpg";

const PAGE_SIZE = 10;

const PRODUCT_TABS = [
  { key: "", label: "All Products", tone: "toneAll", countKey: "All" },
  { key: "Available", label: "Available", tone: "toneAvailable", countKey: "Available" },
  { key: "New", label: "New Arrival", tone: "toneNew", countKey: "New" },
  { key: "BestSeller", label: "Best Seller", tone: "toneBestSeller", countKey: "BestSeller" },
  { key: "Sale", label: "On Sale", tone: "toneSale", countKey: "Sale" },
  { key: "Out", label: "Out of Stock", tone: "toneOut", countKey: "Out" },
];

function Products() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusCounts, setStatusCounts] = useState({ All: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [countDelete, setCountDelete] = useState(0);
  const { showModal, confirmModal } = useModal();
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [refreshKey, setRefreshKey] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams({ page: currentPage, limit: PAGE_SIZE });
    if (searchTerm) params.set("search", searchTerm);
    if (statusFilter) params.set("status", statusFilter);
    if (sortConfig.key && sortConfig.key !== "total") {
      params.set("sortKey", sortConfig.key);
      params.set("sortDir", sortConfig.direction);
    }
    axios
      .get(`/dashboard/products?${params}`)
      .then((res) => {
        let newList = (res.data.listProduct || []).map((product) => {
          const total = Object.values(product.size || {}).reduce(
            (sum, value) => Number(sum) + Number(value || 0),
            0
          );
          return { ...product, total };
        });
        if (sortConfig.key === "total") {
          newList = [...newList].sort((a, b) =>
            sortConfig.direction === "asc" ? a.total - b.total : b.total - a.total
          );
        }
        setCountDelete(res.data.deletedCount || 0);
        setProducts(newList);
        setTotalPages(res.data.totalPages || 1);
        if (res.data.statusCounts) setStatusCounts(res.data.statusCounts);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [currentPage, searchTerm, statusFilter, sortConfig, refreshKey]);

  const handleDeleteSoft = useCallback(
    (id) => {
      if (!id) return;
      axios
        .delete(`/dashboard/products/${id}`)
        .then((res) => {
          showModal({
            title: "Success",
            message: res.data.message,
            type: "success",
          });
          setRefreshKey((k) => k + 1);
        })
        .catch(() =>
          showModal({
            title: "Error",
            message: "An error occurred while deleting!",
            type: "error",
          })
        );
    },
    [showModal]
  );

  const handleSort = useCallback((key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
    setCurrentPage(1);
  }, []);

  const pageNumbers = useMemo(() => {
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
  }, [totalPages, currentPage]);

  const renderSortIcon = useCallback(
    (columnKey) => {
      if (sortConfig.key !== columnKey)
        return (
          <i
            className="fa-solid fa-sort"
            style={{ fontSize: "12px", marginLeft: "5px", opacity: 0.3 }}
          ></i>
        );
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
    },
    [sortConfig]
  );

  const startIndex = (currentPage - 1) * PAGE_SIZE;

  return (
    <div className={styles.tableWrapper}>
      <div className={styles.pageHeader}>
        <div>
          <h2 className={styles.pageTitle}>Product Inventory</h2>
          <p className={styles.pageDesc}>
            Manage footwear catalog, stock levels, pricing, and promotional status
          </p>
        </div>
        <div className={styles.headerActions}>
          {countDelete > 0 && (
            <button
              type="button"
              className={styles.trashButton}
              onClick={() => navigate("/dashboard/products/trash")}
            >
              <i className="fa-solid fa-trash-can"></i>
              <span>Trash ({countDelete})</span>
            </button>
          )}
          <button
            type="button"
            className={styles.addButton}
            onClick={() => navigate("/dashboard/products/create")}
          >
            <i className="fa-solid fa-plus"></i>
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Color-Coded Status Filter Pills */}
      <div className={styles.statusFilterBar}>
        {PRODUCT_TABS.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count = statusCounts[tab.countKey] ?? 0;
          return (
            <button
              key={tab.key || "all"}
              type="button"
              className={clsx(
                styles.statusFilterPill,
                styles[tab.tone],
                isActive && styles.pillActive
              )}
              onClick={() => {
                setStatusFilter(tab.key);
                setCurrentPage(1);
              }}
            >
              <span className={styles.pillDot} />
              <span>{tab.label}</span>
              <span className={styles.pillCount}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.tableControls}>
        <div className={styles.searchBox}>
          <i className="fa-solid fa-magnifying-glass"></i>
          <input
            type="text"
            placeholder="Search by product name or brand..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
      </div>

      <div className={styles.tableResponsive}>
        <table className={styles.table}>
          <thead className={styles.tableTitle}>
            <tr>
              <th className={styles.tableHeader}>#</th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("name")}
              >
                Product {renderSortIcon("name")}
              </th>
              <th className={styles.tableHeader}>Image</th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("total")}
              >
                Stock {renderSortIcon("total")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("status")}
              >
                Status {renderSortIcon("status")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("brand")}
              >
                Brand {renderSortIcon("brand")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("cost")}
              >
                Price {renderSortIcon("cost")}
              </th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product._id} className={styles.tableRow}>
                  <td className={styles.tableCell}>{startIndex + index + 1}</td>
                  <td className={clsx(styles.tableCell, styles.productNameCell)}>
                    <strong>{product.name}</strong>
                  </td>
                  <td className={styles.tableCell}>
                    <img src={product.image?.image1 || no_item} alt={product.name} />
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={clsx(
                        styles.stockNum,
                        product.total === 0 && styles.stockZero
                      )}
                    >
                      {product.total} pairs
                    </span>
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={clsx(
                        styles.tableStatus,
                        product.total === 0 && styles.out,
                        product.total > 0 &&
                          (!product.status || product.status === "null") &&
                          styles.available,
                        product.total > 0 &&
                          product.status === "BestSeller" &&
                          styles.bestseller,
                        product.total > 0 &&
                          product.status === "New" &&
                          styles.new,
                        product.total > 0 &&
                          product.status === "Sale" &&
                          styles.sale
                      )}
                    >
                      <span className={styles.statusDot} />
                      {product.total > 0
                        ? !product.status || product.status === "null"
                          ? "Available"
                          : product.status === "BestSeller"
                          ? "Best Seller"
                          : product.status
                        : "Out of Stock"}
                    </span>
                  </td>
                  <td className={clsx(styles.tableCell, styles.tableBrand)}>
                    {product.brand}
                  </td>
                  <td className={clsx(styles.tableCell, styles.tablePrice)}>
                    {Number(product.cost).toLocaleString("vi-VN")} ₫
                  </td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionBtns}>
                      <button
                        type="button"
                        title="Edit Product"
                        className={styles.editBtn}
                        onClick={() =>
                          navigate(`/dashboard/products/${product._id}`)
                        }
                      >
                        <i className="fa-solid fa-pen-to-square"></i>
                      </button>
                      <button
                        type="button"
                        title="Move to Trash"
                        className={styles.deleteBtn}
                        onClick={() => {
                          confirmModal({
                            title: "Confirm Deletion",
                            message: "Are you sure you want to delete?",
                            type: "warning",
                            confirmText: "Yes, delete",
                            onConfirm: () => handleDeleteSoft(product._id),
                          });
                        }}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: "center", padding: "40px", fontSize: "1.5rem", color: "#6b7280" }}>
                  No products found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 0 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            <i className="fa-solid fa-caret-left"></i>
          </button>
          {pageNumbers.map((p, i) =>
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
    </div>
  );
}

export default Products;
