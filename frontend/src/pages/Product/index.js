import { useEffect, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import styles from "./Product.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import axios from "../../util/axios";

import no_img from "../../assets/images/no_img.jpg";
import Pagination from "../../components/Pagination";

const ProductSkeleton = () => (
  <div className={clsx("col col-4 col-md-6 col-sm-6", styles.productCard)}>
    <div className={styles.cardInner}>
      <div
        className={clsx(styles.productImage, styles.skeleton)}
        style={{ aspectRatio: "1 / 1" }}
      ></div>
      <div className={clsx(styles.productInfo)}>
        <div
          className={clsx(styles.skeleton)}
          style={{ height: "18px", width: "80%", marginBottom: "8px" }}
        ></div>
        <div
          className={clsx(styles.skeleton)}
          style={{ height: "18px", width: "45%" }}
        ></div>
      </div>
    </div>
  </div>
);

const sorts = [
  "Best Sellers",
  "Newest",
  "Price High To Low",
  "Price Low To High",
];
const types = ["High", "Hype", "Mid", "Low"];
const colors = [
  { value: "red", label: "Red" },
  { value: "yellow", label: "Yellow" },
  { value: "orange", label: "Orange" },
  { value: "blue", label: "Blue" },
  { value: "brown", label: "Brown" },
  { value: "gray", label: "Gray" },
  { value: "purple", label: "Purple" },
  { value: "black", label: "Black" },
  { value: "#ffecec", label: "Soft Pink" },
  { value: "#ffddc1", label: "Peach" },
  { value: "green", label: "Green" },
  { value: "white", label: "White" },
];
const priceOptions = [
  { min: 1000000, max: 2000000, label: "1.000.000₫ – 2.000.000₫" },
  { min: 2000000, max: 3000000, label: "2.000.000₫ – 3.000.000₫" },
  { min: 3000000, max: 4000000, label: "3.000.000₫ – 4.000.000₫" },
  { min: 4000000, max: 9999999, label: "Trên 4.000.000₫" },
];

function getOriginalSalePrice(cost) {
  const num = Number(cost) || 0;
  return Math.round((num * 1.25) / 10000) * 10000;
}

function Product() {
  const { brand } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const [selectedSort, setSelectedSort] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  // Open filter sections by default so the sidebar is immediately usable
  const [openSort, setOpenSort] = useState(true);
  const [openType, setOpenType] = useState(true);
  const [openColor, setOpenColor] = useState(true);
  const [openPrice, setOpenPrice] = useState(true);

  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const currentPage = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const hasActiveFilters = Boolean(
    selectedSort || selectedColor || selectedType || minPrice || maxPrice
  );

  const activeFilterCount = [
    selectedSort,
    selectedType,
    selectedColor,
    minPrice || maxPrice,
  ].filter(Boolean).length;

  const handleClearAllFilters = () => {
    setSelectedSort("");
    setSelectedColor("");
    setSelectedType("");
    setSelectedPrice(null);
    setMinPrice("");
    setMaxPrice("");
  };

  const handlePageChange = (page) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", page);
      return next;
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset về trang 1 khi filter thay đổi
  useEffect(() => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set("page", "1");
      return next;
    });
  }, [brand, selectedColor, selectedType, minPrice, maxPrice, selectedSort]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setLoading(true);

    let url = `/product/${brand}?page=${currentPage}&limit=12&`;
    if (selectedSort) url += `sort=${encodeURIComponent(selectedSort)}&`;
    if (selectedColor) url += `color=${encodeURIComponent(selectedColor)}&`;
    if (selectedType) url += `type=${encodeURIComponent(selectedType)}&`;
    if (minPrice) url += `min=${encodeURIComponent(minPrice)}&`;
    if (maxPrice) url += `max=${encodeURIComponent(maxPrice)}&`;

    axios(url)
      .then((res) => {
        setProducts(res.data.newProduct || []);
        setTotalPages(res.data.totalPages || 1);
        setTotalProducts(res.data.total || 0);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi:", err);
        setLoading(false);
      });
  }, [brand, selectedColor, selectedType, minPrice, maxPrice, selectedSort, currentPage]);

  const colorLabel =
    colors.find((c) => c.value === selectedColor)?.label || selectedColor;

  return (
    <div className="container">
      {/* Breadcrumb */}
      <div className={clsx("mt-28", styles.breadcrumb)}>
        <Link
          className={clsx("opacity-text", styles.breadcrumb__link)}
          to="/"
        >
          Home
        </Link>
        <span className={clsx("mx-5", styles.breadcrumb__divider)}>
          /
        </span>
        <span className={styles.breadcrumb__current}>{brand}</span>
      </div>

      {/* Top Hero Header for Brand */}
      <div className={styles.brandBanner}>
        <h1 className={styles.productListTitle}>{brand}</h1>
        {!loading && (
          <span className={styles.productCountBadge}>
            {totalProducts} {totalProducts === 1 ? "Product" : "Products"}
          </span>
        )}
      </div>

      {/* Mobile & Tablet Filter Bar */}
      <div className={styles.mobileToolbar}>
        <button
          type="button"
          className={styles.mobileFilterBtn}
          onClick={() => setShowMobileFilter(true)}
        >
          <i className="fa-solid fa-sliders"></i>
          <span>Filter & Sort</span>
          {activeFilterCount > 0 && (
            <span className={styles.filterCountPill}>{activeFilterCount}</span>
          )}
        </button>

        {hasActiveFilters && (
          <button
            type="button"
            className={styles.mobileClearBtn}
            onClick={handleClearAllFilters}
          >
            Reset all
          </button>
        )}
      </div>

      <div className={clsx("row", styles.mainRow)}>
        {/* Overlay cho Mobile & Tablet */}
        <div
          className={clsx(styles.overlay, showMobileFilter && styles.active)}
          onClick={() => setShowMobileFilter(false)}
        ></div>

        {/* Sidebar Filter */}
        <aside
          className={clsx(
            "col col-3",
            styles.sidebar,
            showMobileFilter && styles.open
          )}
        >
          <div className={styles.sidebarTopBar}>
            <div className={styles.sidebarHeading}>
              <i className="fa-solid fa-sliders"></i>
              <span>Filters</span>
            </div>
            <div className={styles.sidebarTopActions}>
              {hasActiveFilters && (
                <button
                  type="button"
                  className={styles.clearAllBtn}
                  onClick={handleClearAllFilters}
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                className={styles.closeSidebarBtn}
                onClick={() => setShowMobileFilter(false)}
                aria-label="Close filters"
              >
                &times;
              </button>
            </div>
          </div>

          {/* Sort */}
          <div className={styles.section}>
            <div
              className={styles.header}
              onClick={() => setOpenSort(!openSort)}
            >
              <h3 className={styles.sidebarTitle}>Sort By</h3>
              <button type="button" className={styles.toggleBtn}>
                {openSort ? "—" : "+"}
              </button>
            </div>
            {openSort && (
              <ul className={styles.sidebarList__type}>
                {sorts.map((type, idx) => (
                  <li key={idx} className={styles.type__Item}>
                    <label
                      className={clsx(
                        styles.type__link,
                        selectedSort === type && styles.activeOption
                      )}
                    >
                      <input
                        type="checkbox"
                        name="sort"
                        value={type}
                        checked={selectedSort === type}
                        onChange={() =>
                          setSelectedSort(selectedSort === type ? "" : type)
                        }
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
              <h3 className={styles.sidebarTitle}>Silhouette</h3>
              <button type="button" className={styles.toggleBtn}>
                {openType ? "—" : "+"}
              </button>
            </div>
            {openType && (
              <ul className={styles.sidebarList__type}>
                {types.map((type, idx) => (
                  <li key={idx} className={styles.type__Item}>
                    <label
                      className={clsx(
                        styles.type__link,
                        selectedType === type && styles.activeOption
                      )}
                    >
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
                      <span>{type} Top</span>
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
              <button type="button" className={styles.toggleBtn}>
                {openColor ? "—" : "+"}
              </button>
            </div>
            {openColor && (
              <div className={styles.colorGrid}>
                {colors.map((c) => (
                  <button
                    type="button"
                    key={c.value}
                    title={c.label}
                    className={clsx(
                      styles.colorCircle,
                      selectedColor === c.value && styles.selected
                    )}
                    style={{ backgroundColor: c.value }}
                    onClick={() =>
                      setSelectedColor(
                        selectedColor === c.value ? "" : c.value
                      )
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
              <h3 className={styles.sidebarTitle}>Price Range (VNĐ)</h3>
              <button type="button" className={styles.toggleBtn}>
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
                      if (val === "" || Number(val) >= 0) setMinPrice(val);
                      setSelectedPrice(null);
                    }}
                  />
                  <span className={styles.inputDivider}>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || Number(val) >= 0) setMaxPrice(val);
                      setSelectedPrice(null);
                    }}
                  />
                </div>

                <div className={styles.options}>
                  {priceOptions.map((option, index) => (
                    <label
                      key={index}
                      className={clsx(
                        styles.option,
                        selectedPrice === index && styles.activeOption
                      )}
                    >
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
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </>
            )}
          </div>
        </aside>

        {/* Danh sách sản phẩm */}
        <div className={clsx("col col-9 col-md-12 col-sm-12", styles.productList)}>
          {/* Active Filter Pills */}
          {hasActiveFilters && (
            <div className={styles.activeFiltersBar}>
              <span className={styles.activeFiltersLabel}>Active filters:</span>
              {selectedSort && (
                <button
                  type="button"
                  className={styles.filterChip}
                  onClick={() => setSelectedSort("")}
                >
                  <span>Sort: {selectedSort}</span>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
              {selectedType && (
                <button
                  type="button"
                  className={styles.filterChip}
                  onClick={() => setSelectedType("")}
                >
                  <span>Style: {selectedType}</span>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
              {selectedColor && (
                <button
                  type="button"
                  className={styles.filterChip}
                  onClick={() => setSelectedColor("")}
                >
                  <span
                    className={styles.chipColorDot}
                    style={{ backgroundColor: selectedColor }}
                  />
                  <span>Color: {colorLabel}</span>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
              {(minPrice || maxPrice) && (
                <button
                  type="button"
                  className={styles.filterChip}
                  onClick={() => {
                    setMinPrice("");
                    setMaxPrice("");
                    setSelectedPrice(null);
                  }}
                >
                  <span>
                    Price: {minPrice ? `${Number(minPrice).toLocaleString("vi-VN")}₫` : "0₫"} –{" "}
                    {maxPrice ? `${Number(maxPrice).toLocaleString("vi-VN")}₫` : "∞"}
                  </span>
                  <i className="fa-solid fa-xmark"></i>
                </button>
              )}
              <button
                type="button"
                className={styles.clearChipsBtn}
                onClick={handleClearAllFilters}
              >
                Clear all
              </button>
            </div>
          )}

          <div className={clsx("row", styles.productGrid)}>
            {loading ? (
              Array(6)
                .fill(0)
                .map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length > 0 ? (
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
                    <div className={styles.imageBox}>
                      {product.status && product.status !== "null" && (
                        <span
                          className={clsx(styles.badge, {
                            [styles.new]: product.status === "New",
                            [styles.sale]: product.status === "Sale",
                            [styles.BestSeller]:
                              product.status === "BestSeller",
                          })}
                        >
                          {product.status === "BestSeller"
                            ? "Best Seller"
                            : product.status}
                        </span>
                      )}
                      <img
                        src={product.image?.image1 || no_img}
                        alt={product.name}
                        className={styles.productImage}
                      />
                    </div>
                    <div className={styles.productInfo}>
                      <div className={styles.productBrandTag}>
                        {product.brand}
                      </div>
                      <p className={styles.productName}>{product.name}</p>
                      <span className={styles.productDescription}>
                        {product.description || "\u00A0"}
                      </span>
                      <div className={styles.productPriceRow}>
                        <span className={styles.productPrice}>
                          {Number(product.cost).toLocaleString("vi-VN")}₫
                        </span>
                        {product.status === "Sale" && (
                          <span className={styles.oldPrice}>
                            {getOriginalSalePrice(product.cost).toLocaleString(
                              "vi-VN"
                            )}
                            ₫
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <div className={clsx("col col-12", styles.emptyState)}>
                <i className="fa-solid fa-box-open"></i>
                <h4>No products found matching your selection</h4>
                <p>Try removing some filters or resetting your search criteria.</p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className={styles.resetEmptyBtn}
                    onClick={handleClearAllFilters}
                  >
                    Reset all filters
                  </button>
                )}
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
  );
}

export default Product;
