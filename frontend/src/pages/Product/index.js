import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";
import axios from "../../util/axios";

import no_img from "../../assets/images/no_img.jpg";
import ScrollToTop from "../../components/ScrollToTop";

const sorts = [
  "Best Sellers",
  "Newest",
  "Price High To Low",
  "Price Low To High",
];
const types = ["High", "Hype", "Mid", "Low"];
const colors = [
  "red",
  "yellow",
  "orange",
  "blue",
  "brown",
  "gray",
  "purple",
  "black",
  "#ffecec",
  "#ffddc1",
  "green",
  "white",
];
const priceOptions = [
  { min: 1000000, max: 2000000 },
  { min: 2000000, max: 3000000 },
  { min: 3000000, max: 4000000 },
  { min: 4000000, max: 9999999 },
];

function Product() {
  const { brand } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedSort, setSelectedSort] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [openSort, setOpenSort] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLoading(true);
    let url = `/product/${brand}?`;

    if (selectedSort) url += `sort=${selectedSort}&`;
    if (selectedColor) url += `color=${selectedColor}&`;
    if (selectedType) url += `type=${selectedType}&`;
    if (minPrice) url += `min=${minPrice}&`;
    if (maxPrice) url += `max=${maxPrice}&`;

    axios(url)
      .then((res) => {
        setProducts(res.data.newProduct || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  }, [brand, selectedColor, selectedType, minPrice, maxPrice, selectedSort]);

  const ProductSkeleton = () => (
    <div className={clsx("col col-4 col-md-6 col-sm-6", styles.productCard)}>
      <div
        className={clsx(styles.productImage, styles.skeleton)}
        style={{ height: "300px" }}
      ></div>
      <div className={clsx(styles.productInfo)}>
        <div
          className={clsx(styles.skeleton)}
          style={{ height: "20px", width: "80%", marginBottom: "5px" }}
        ></div>
        <div
          className={clsx(styles.skeleton)}
          style={{ height: "20px", width: "40%" }}
        ></div>
      </div>
    </div>
  );

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
          <Link
            className={styles.breadcrumb__link}
            to={`product/brand/${brand}`}
          >
            {brand}
          </Link>
        </div>

        <div className={clsx("row mt-28", styles.mainRow)}>
          {/* --- Nút mở Filter Mobile --- */}
          <div className="col col-12 display-md-none">
            <button
              className={styles.mobileFilterBtn}
              onClick={() => setShowMobileFilter(true)}
            >
              <i className="fa-solid fa-filter"></i> FILTER & SORT
            </button>
          </div>

          {/* --- Overlay cho Mobile --- */}
          <div
            className={clsx(styles.overlay, showMobileFilter && styles.active)}
            onClick={() => setShowMobileFilter(false)}
          ></div>

          {/* --- Sidebar (Về lại col-3) --- */}
          <div
            className={clsx(
              "col col-3",
              styles.sidebar,
              showMobileFilter && styles.open
            )}
          >
            <button
              className={styles.closeSidebarBtn}
              onClick={() => setShowMobileFilter(false)}
            >
              &times;
            </button>

            {/* Sort */}
            <div className={styles.section}>
              <div
                className={styles.header}
                onClick={() => setOpenSort(!openSort)}
              >
                <h3 className={styles.sidebarTitle}>SORT BY</h3>
                <button className={styles.toggleBtn}>
                  {openSort ? "—" : "+"}
                </button>
              </div>
              {openSort && (
                <ul className={styles.sidebarList__type}>
                  {sorts.map((type, idx) => (
                    <li key={idx} className={styles.type__Item}>
                      <label className={styles.type__link}>
                        <input
                          type="radio"
                          name="sort"
                          value={type}
                          checked={selectedSort === type}
                          onChange={() => setSelectedSort(type)}
                        />
                        <span>{type}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Category */}
            <div className={styles.section}>
              <div
                className={styles.header}
                onClick={() => setOpenType(!openType)}
              >
                <h3 className={styles.sidebarTitle}>CATEGORY</h3>
                <button className={styles.toggleBtn}>
                  {openType ? "—" : "+"}
                </button>
              </div>
              {openType && (
                <ul className={styles.sidebarList__type}>
                  {types.map((type, idx) => (
                    <li key={idx} className={styles.type__Item}>
                      <label className={styles.type__link}>
                        <input
                          type="checkbox"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={() =>
                            selectedType === type
                              ? setSelectedType("")
                              : setSelectedType(type)
                          }
                        />
                        <span>{type}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Color */}
            <div className={styles.section}>
              <div
                className={styles.header}
                onClick={() => setOpenColor(!openColor)}
              >
                <h3 className={styles.sidebarTitle}>Color</h3>
                <button className={styles.toggleBtn}>
                  {openColor ? "—" : "+"}
                </button>
              </div>
              {openColor && (
                <div className={styles.colorGrid}>
                  {colors.map((color) => (
                    <div
                      key={color}
                      className={clsx(
                        styles.colorCircle,
                        selectedColor === color && styles.selected
                      )}
                      style={{ backgroundColor: color }}
                      onClick={() =>
                        setSelectedColor(selectedColor === color ? "" : color)
                      }
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Price */}
            <div className={styles.section}>
              <div
                className={styles.header}
                onClick={() => setOpenPrice(!openPrice)}
              >
                <h3 className={styles.sidebarTitle}>Price</h3>
                <button className={styles.toggleBtn}>
                  {openPrice ? "—" : "+"}
                </button>
              </div>
              {openPrice && (
                <>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val >= 0) setMinPrice(val);
                        setSelectedPrice(null);
                      }}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val >= 0) setMaxPrice(val);
                        setSelectedPrice(null);
                      }}
                    />
                  </div>

                  <div className={styles.options}>
                    {priceOptions.map((option, index) => (
                      <label key={index} className={styles.option}>
                        <input
                          type="checkbox"
                          name="price"
                          checked={selectedPrice === index}
                          onChange={() => {
                            if (selectedPrice === index) {
                              setSelectedPrice(null);
                              setMinPrice("");
                              setMaxPrice("");
                            } else {
                              setSelectedPrice(index);
                              setMinPrice(option.min);
                              setMaxPrice(option.max);
                            }
                          }}
                        />
                        {Number(option.min).toLocaleString("vi-VN")}đ -{" "}
                        {Number(option.max).toLocaleString("vi-VN")}đ
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* --- Danh sách sản phẩm (Về lại col-9) --- */}
          <div className={clsx("col col-9 col-sm-12", styles.productList)}>
            <h3 className={styles.productListTitle}>{brand}</h3>
            <div className={clsx("row", styles.productGrid)}>
              {loading ? (
                Array(6)
                  .fill(0)
                  .map((_, i) => <ProductSkeleton key={i} />)
              ) : products.length > 0 ? (
                products.map((product) => (
                  // Về lại col-4 (3 sản phẩm/hàng) như cũ
                  <div
                    key={product._id}
                    className={clsx(
                      "col col-4 col-md-6 col-sm-6",
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
                          <p className={styles.productName}>{product.name}</p>
                          <span className={styles.productPrice}>
                            {Number(product.cost).toLocaleString("vi-VN")}₫
                          </span>
                        </div>
                        <span className={styles.productDescription}>
                          {product.description || "\u00A0"}
                        </span>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="col col-12 text-center">
                  <p
                    style={{
                      fontSize: "1.6rem",
                      color: "#888",
                      marginTop: "20px",
                    }}
                  >
                    No products found matching your selection.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Product;
