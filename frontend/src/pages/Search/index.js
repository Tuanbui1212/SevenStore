import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Product.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";

import no_img from "../../assets/images/no_img.jpg";

function Sreach() {
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get("value") || "";

  useEffect(() => {
    let url = `http://localhost:5000/search?value=${value}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data.product || []))
      .catch((err) => console.error("Lỗi:", err));
  }, [value]);

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
          {/* Danh sách sản phẩm */}
          <div className={clsx("col col-12", styles.productList)}>
            <div className={clsx("row", styles.productGrid)}>
              {products && products.length > 0 ? (
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
                        alt="Sneaker"
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
                <p>No products found</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sreach;
