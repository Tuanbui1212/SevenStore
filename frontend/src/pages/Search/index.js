import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Product.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";
import axios from "../../util/axios";

import no_img from "../../assets/images/no_img.jpg";
import Pagination from "../../components/Pagination";

const PAGE_LIMIT = 12;

function Sreach() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get("value") || "";

  // Reset page khi từ khoá tìm kiếm thay đổi
  useEffect(() => {
    setCurrentPage(1);
  }, [value]);

  useEffect(() => {
    if (!value) return;
    setLoading(true);

    axios
      .get(`/search?value=${encodeURIComponent(value)}&page=${currentPage}&limit=${PAGE_LIMIT}`)
      .then((res) => {
        setProducts(res.data.product || []);
        setTotalPages(res.data.totalPages || 1);
        setTotal(res.data.total || 0);
        window.scrollTo({ top: 0, behavior: "smooth" });
      })
      .catch((err) => console.error("Lỗi:", err))
      .finally(() => setLoading(false));
  }, [value, currentPage]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  return (
    <>
      <div className="container">
        {/* Breadcrumb */}
        <div className={clsx("row mt-28", styles.breadcrumb)}>
          <Link
            className={clsx("opacity-text", styles.breadcrumb__link)}
            to="/"
          >
            Home
          </Link>
          <span className={clsx("mx-5", styles.breadcrumb__divider)}>
            {" "}
            &gt;{" "}
          </span>
          <Link className={styles.breadcrumb__link} to={`search`}>
            SEARCH
          </Link>
        </div>

        <div className={clsx("row mt-28", styles.mainRow)}>
          <div className={clsx("col col-12", styles.productList)}>
            {/* Header: từ khoá + số kết quả */}
            <div className={styles.searchHeader}>
              <h3 className={styles.searchTitle}>
                Results for:{" "}
                <span className={styles.searchKeyword}>"{value}"</span>
              </h3>
              {!loading && (
                <span className={styles.searchCount}>
                  {total} product{total !== 1 ? "s" : ""} found
                </span>
              )}
            </div>

            <div className={clsx("row", styles.productGrid)}>
              {loading ? (
                Array(8)
                  .fill(0)
                  .map((_, i) => (
                    <div
                      key={i}
                      className={clsx(
                        "col col-3 col-md-6 col-sm-6",
                        styles.productCard
                      )}
                    >
                      <div
                        className={clsx(styles.productImage, styles.skeleton)}
                        style={{ height: "280px" }}
                      />
                      <div className={styles.productInfo}>
                        <div
                          className={styles.skeleton}
                          style={{ height: "16px", width: "80%", marginBottom: "6px" }}
                        />
                        <div
                          className={styles.skeleton}
                          style={{ height: "16px", width: "40%" }}
                        />
                      </div>
                    </div>
                  ))
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product._id}
                    className={clsx(
                      "col col-3 col-md-6 col-sm-6",
                      styles.productCard
                    )}
                  >
                    <Link
                      to={`/product/${product.brand}/${product.slug}`}
                      className={styles.productLink}
                    >
                      {product.status !== "null" && (
                        <span
                          className={clsx(styles.badge, {
                            [styles.new]: product.status === "New",
                            [styles.sale]: product.status === "Sale",
                            [styles.BestSeller]:
                              product.status === "BestSeller",
                          })}
                        >
                          {product.status}
                        </span>
                      )}
                      <img
                        src={product.image.image1 || no_img}
                        alt={product.name}
                        className={styles.productImage}
                      />
                      <div className={styles.productInfo}>
                        <div className={styles.productTop}>
                          <span className={styles.productName}>
                            {product.name}
                          </span>
                          <span className={styles.productPrice}>
                            {Number(product.cost).toLocaleString("vi-VN")}
                          </span>
                        </div>
                        <span className={styles.productDescription}>
                          {product.description}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className={clsx("col col-12", styles.noResult)}>
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <p>No products found for "{value}"</p>
                  <Link to="/product/all">Browse all products</Link>
                </div>
              )}
            </div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default Sreach;
