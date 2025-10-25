import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import styles from "./Product.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";

import no_img from "../../assets/images/no_img.jpg";

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

function Sreach() {
  const { brand } = useParams();
  const [products, setProducts] = useState([]);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const value = params.get("value") || "";

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
    let url = `http://localhost:5000/search?value=${value}`;

    if (selectedSort) url += `sort=${selectedSort}&`;
    if (selectedColor) url += `color=${selectedColor}&`;
    if (selectedType) url += `type=${selectedType}&`;
    if (minPrice) url += `min=${minPrice}&`;
    if (maxPrice) url += `max=${maxPrice}&`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => setProducts(data.product || []))
      .catch((err) => console.error("Lỗi:", err));
  }, [
    value,
    brand,
    selectedColor,
    selectedType,
    minPrice,
    maxPrice,
    selectedSort,
  ]);

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
            {/* --- Sắp xếp theo --- */}
            <div className={styles.section}>
              <div className={styles.header}>
                <h3 className={styles.sidebarTitle}>SORT BY</h3>
                <button
                  className={styles.toggleBtn}
                  onClick={() => setOpenSort(!openSort)}
                >
                  {openSort ? "—" : "+"}
                </button>
              </div>
              {openSort && (
                <ul className={styles.sidebarList__type}>
                  {sorts.map((type, idx) => (
                    <li key={idx} className={styles.type__Item}>
                      <label className={styles.type__link}>
                        <input
                          type="checkbox"
                          name="type"
                          value={type}
                          checked={selectedSort === type}
                          onChange={() =>
                            selectedSort === type
                              ? setSelectedSort("")
                              : setSelectedSort(type)
                          }
                        />
                        <span>{type}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
            </div>
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
                      onClick={() => {
                        const newColor = selectedColor === color ? "" : color;
                        setSelectedColor(newColor);
                        //handleSubmitColor(newColor);
                      }}
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
                      placeholder="0đ"
                      value={minPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val >= 0) setMinPrice(val);
                      }}
                    />
                    <span>—</span>
                    <input
                      type="number"
                      placeholder="0đ"
                      value={maxPrice}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val >= 0) setMaxPrice(val);
                      }}
                    />
                  </div>

                  <div className={styles.options}>
                    {priceOptions.map((option, index) => (
                      <label key={index} className={styles.option}>
                        <input
                          type="checkbox"
                          name="price"
                          checked={
                            selectedPrice === index &&
                            minPrice === option.min &&
                            maxPrice === option.max
                          }
                          onChange={() => {
                            setSelectedPrice(
                              (prev) => (prev === index ? "" : index) // click lại => bỏ chọn
                            );
                            setMinPrice((prev) =>
                              selectedPrice === index ? "" : option.min
                            );
                            setMaxPrice((prev) =>
                              selectedPrice === index ? "" : option.max
                            );
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
