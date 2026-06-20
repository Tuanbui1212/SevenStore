import styles from "./StatisticalReport.module.scss";
import clsx from "clsx";
import { useEffect, useState } from "react";
import axios from "../../util/axios";

function StatisticalReport() {
  const [summary, setSummary] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  });
  const [monthlyStats, setMonthlyStats] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: "month",
    direction: "desc",
  });
  const [isLoading, setIsLoading] = useState(true);

  const pageSize = 6;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get("/dashboard/orders/stats")
      .then((res) => {
        const { stats, totalRevenue, totalOrders, totalProducts, totalCustomers } = res.data;
        setSummary({ totalRevenue, totalOrders, totalProducts, totalCustomers });
        const statsWithDateObj = (stats || []).map((item) => ({
          ...item,
          dateObj: new Date(item.year, item.monthNum - 1, 1),
        }));
        setMonthlyStats(statsWithDateObj);
      })
      .catch((err) => console.error("Lỗi tải thống kê:", err))
      .finally(() => setIsLoading(false));
  }, []);

  // --- CÁC PHẦN DƯỚI GIỮ NGUYÊN GIAO DIỆN CŨ ---

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = monthlyStats.filter((item) =>
    item.month.includes(searchTerm)
  );

  if (sortConfig.key) {
    filteredData.sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      if (sortConfig.key === "month") {
        // Sort tháng đặc biệt hơn chút (dựa vào dateObj đã lưu lúc tính)
        aValue = a.dateObj;
        bValue = b.dateObj;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
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
  };

  return (
    <div className={clsx("mt-36", styles.wrapper)}>
      {/* 1. Summary Cards */}
      <div className={styles.summaryGrid}>
        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Total Revenue</span>
            <span className={styles.cardNumber}>
              {summary.totalRevenue.toLocaleString("vi-VN")} đ
            </span>
          </div>
          <div className={clsx(styles.cardIcon, styles.iconGreen)}>
            <i className="fa-solid fa-sack-dollar"></i>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Total Orders</span>
            <span className={styles.cardNumber}>{summary.totalOrders}</span>
          </div>
          <div className={clsx(styles.cardIcon, styles.iconBlue)}>
            <i className="fa-solid fa-cart-shopping"></i>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Products</span>
            <span className={styles.cardNumber}>{summary.totalProducts}</span>
          </div>
          <div className={clsx(styles.cardIcon, styles.iconOrange)}>
            <i className="fa-solid fa-box-open"></i>
          </div>
        </div>

        <div className={styles.card}>
          <div className={styles.cardInfo}>
            <span className={styles.cardLabel}>Customers</span>
            <span className={styles.cardNumber}>{summary.totalCustomers}</span>
          </div>
          <div className={clsx(styles.cardIcon, styles.iconPurple)}>
            <i className="fa-solid fa-users"></i>
          </div>
        </div>
      </div>

      {/* 2. Table Section */}
      <div className={styles.tableWrapper}>
        <div className={styles.tableControls}>
          <input
            type="text"
            placeholder="Search by month (e.g. 12/2025)..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <table className={styles.table}>
          <thead className={styles.tableTitle}>
            <tr>
              <th className={styles.tableHeader}>#</th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("month")}
              >
                Month {renderSortIcon("month")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("orders")}
              >
                Orders {renderSortIcon("orders")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("revenue")}
              >
                Revenue {renderSortIcon("revenue")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("profit")}
              >
                Profit (Est. 30%) {renderSortIcon("profit")}
              </th>
              <th
                className={clsx(styles.tableHeader, styles.sortable)}
                onClick={() => handleSort("growth")}
              >
                Growth {renderSortIcon("growth")}
              </th>
              <th className={styles.tableHeader}>Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "30px" }}
                >
                  <i className="fa-solid fa-spinner fa-spin"></i> Loading...
                </td>
              </tr>
            ) : currentData.length > 0 ? (
              currentData.map((item, index) => (
                <tr key={index} className={styles.tableRow}>
                  <td className={styles.tableCell}>{startIndex + index + 1}</td>
                  <td className={styles.tableCell}>
                    <strong>{item.month}</strong>
                  </td>
                  <td className={styles.tableCell}>{item.orders}</td>
                  <td className={clsx(styles.tableCell, styles.revenueText)}>
                    {item.revenue.toLocaleString("vi-VN")} đ
                  </td>
                  <td className={clsx(styles.tableCell, styles.profitText)}>
                    {item.profit.toLocaleString("vi-VN")} đ
                  </td>
                  <td
                    className={clsx(
                      styles.tableCell,
                      item.growth >= 0 ? styles.growthUp : styles.growthDown
                    )}
                  >
                    {item.growth > 0 ? "+" : ""}
                    {item.growth}%
                  </td>
                  <td className={styles.tableCell}>
                    <span
                      className={clsx(
                        styles.statusBadge,
                        styles[item.status?.toLowerCase()]
                      )}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  style={{ textAlign: "center", padding: "20px" }}
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination giữ nguyên */}
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
      </div>
    </div>
  );
}

export default StatisticalReport;
