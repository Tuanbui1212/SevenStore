import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./Product.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";

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
  { min: 49, max: 100 },
  { min: 100, max: 200 },
  { min: 300, max: 400 },
  { min: 500, max: 600 },
];

function Product() {
  const { brand } = useParams(); // Lấy brand từ URL
  const [products, setProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedType, setSelectedType] = useState("");

  const [selectedPrice, setSelectedPrice] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // state toggle
  const [openType, setOpenType] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openPrice, setOpenPrice] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:5000/product/${brand}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.newProduct);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [brand]);

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
          {/* --- sidebar --- */}
          <div className={clsx("col col-3 display-sm-none", styles.sidebar)}>
            {/* --- Phân loại --- */}
            <div className={styles.section}>
              <div className={styles.header}>
                <h3 className={styles.sidebarTitle}>CATEGORY</h3>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setOpenType(!openType)}
                >
                  {openType ? "—" : "+"}
                </button>
              </div>
              {openType && (
                <ul className={styles.sidebarList__type}>
                  {types.map((type, idx) => (
                    <li key={idx} className={styles.type__Item}>
                      <label className={styles.type__link}>
                        <input
                          type="radio"
                          name="type"
                          value={type}
                          checked={selectedType === type}
                          onChange={() => setSelectedType(type)}
                        />
                        <span>{type}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* --- Màu sắc --- */}
            <div className={styles.section}>
              <div className={styles.header}>
                <h3 className={styles.sidebarTitle}>Color</h3>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setOpenColor(!openColor)}
                >
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
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* --- Giá --- */}
            <div className={styles.section}>
              <div className={styles.header}>
                <h3 className={styles.sidebarTitle}>Price</h3>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setOpenPrice(!openPrice)}
                >
                  {openPrice ? "—" : "+"}
                </button>
              </div>
              {openPrice && (
                <>
                  <div className={styles.inputGroup}>
                    <input
                      type="number"
                      placeholder="0$"
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="0$"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                    />
                  </div>

                  <div className={styles.options}>
                    {priceOptions.map((option, index) => (
                      <label key={index} className={styles.option}>
                        <input
                          type="radio"
                          name="price"
                          checked={selectedPrice === index}
                          onChange={() => {
                            setSelectedPrice(index);
                            setMinPrice(option.min);
                            setMaxPrice(option.max);
                          }}
                        />
                        {option.min.toFixed(2)}$ - {option.max.toFixed(2)}$
                      </label>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Danh sách sản phẩm */}
          <div className={clsx("col col-9 col-sm-12", styles.productList)}>
            <h3 className={styles.productListTitle}>{brand}</h3>
            <div className={clsx("row", styles.productGrid)}>
              {products && products.length > 0 ? (
                products.map((product) => (
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
                      <img
                        src={product.image.image1}
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

export default Product;
