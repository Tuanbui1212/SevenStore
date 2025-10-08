import clsx from "clsx";
import { Link } from "react-router";
import { useParams } from "react-router-dom";
import { use, useEffect, useState } from "react";

import styles from "./ProductDetail.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";

function ProductDetail() {
  const { brand, slug } = useParams();
  const [product, setProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetch(`http://localhost:5000/product/${brand}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.newProduct);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    fetch(`http://localhost:5000/product/${brand}/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data.productDetail);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [brand, slug]);

  return (
    <>
      <div className={clsx("container")}>
        <div className="row">
          {/* Breadcrumb */}
          <div className={clsx("col col-12 mt-28", styles.breadcrumb)}>
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
              className={clsx("opacity-text", styles.breadcrumb__link)}
              to={`/product/${brand}`}
            >
              {brand}
            </Link>
            <span className={clsx("mx-5", styles.breadcrumb__divider)}>
              {" "}
              &gt;{" "}
            </span>
            <Link className={styles.breadcrumb__link} to={""}>
              {product.name}
            </Link>
          </div>
        </div>

        <div className="row mt-28">
          <div className={clsx("col col-7", styles.list__img__detail)}>
            {product.image &&
              Object.values(product.image).map((src, index) => (
                <div key={index} className={clsx(styles.item__img__detail)}>
                  <img src={src} alt={`product-image-${index}`} />
                </div>
              ))}
          </div>
          <div className={clsx("col col-5")}>
            <div className={clsx(styles.info__product)}>
              <span className={clsx(styles.name__product)}>{product.name}</span>
              <span className={clsx(styles.description__product)}>
                {product.description}
              </span>
              <span
                className={clsx(
                  styles.status__product,
                  product.status === "New" && styles.status__new,
                  product.status === "BestSeller" && styles.status__bestSeller
                )}
              >
                {product.status}
              </span>
              <span className={clsx(styles.price__product)}>
                {Number(product.cost).toLocaleString("vi-VN")} đ
              </span>

              <div className={clsx(styles.color__selector)}>
                <span className={clsx(styles.color__title)}>Color</span>
                <span className={clsx(styles.color__description)}>
                  {product.color}
                </span>
                <div className={clsx(styles.color__grid)}>
                  {products
                    .filter((p) => p.name === product.name)
                    .map((p, index) => (
                      <Link key={index} to={`/product/${p.brand}/${p.slug}`}>
                        <img
                          className={
                            p.slug === product.slug && styles.color__active
                          }
                          src={p.image.image1}
                          alt=""
                        />
                      </Link>
                    ))}
                </div>
              </div>

              <div className={styles.size__selector}>
                <div className={styles.size__title}>Size</div>
                <div className={styles.size__grid}>
                  {product.size &&
                    Object.entries(product.size).map(
                      ([name, values], index) => (
                        <button
                          key={index}
                          className={clsx(
                            styles.size__box,
                            values === 0 && styles.disabled
                          )}
                          onClick={() => console.log(Math.random())}
                          disabled={values === 0}
                        >
                          {name.replace("size", "")}
                        </button>
                      )
                    )}
                </div>
              </div>

              <div className={clsx(styles.actions__buy)}>
                <div className={clsx(styles.quantity)}>
                  <button
                    onClick={() => setQuantity((q) => q - 1)}
                    disabled={quantity <= 0}
                  >
                    -
                  </button>
                  <input
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val >= 0) setQuantity(val);
                    }}
                  />
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    disabled={quantity < 0}
                  >
                    +
                  </button>
                </div>
                <button className={clsx(styles.add__cart)}>Add to cart</button>
                <button className={clsx(styles.buy__now)}>
                  <i className="fa-solid fa-bag-shopping"></i> Buy Now
                </button>
              </div>

              <div className={clsx("row mt-36", styles.description__title)}>
                <h1>Miễn phí vận chuyển và trả hàng </h1>
                <span>
                  Miễn phí vận chuyển tiêu chuẩn cho đơn đặt hàng trên 1.200.000
                  VND.
                </span>

                <span>
                  Tìm hiểu thêm Bạn có thể trả lại (các) mặt hàng* trong vòng 14
                  ngày kể từ ngày bạn nhận được đơn đặt hàng. Nhấp vào đây để
                  xem Chính Sách Trả Hàng.
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={clsx("row", styles.content)}>
          <span className={clsx("col", "col-12", styles.title)}>
            YOU MAY ALSO LIKE
          </span>
        </div>

        <div className={clsx("row", styles.new_prouct)}>
          <div className={clsx(styles.list_new_product)}>
            {products.map((product, index) => (
              <Link
                key={index}
                to={`/product/${product._id}`}
                className={clsx("col", "col-3", styles.product_item)}
              >
                <img
                  src={product.image.image1}
                  alt="Sneaker"
                  className={styles.product_img}
                />
                <div className={styles.product_info}>
                  <div className={styles.product_top}>
                    <span className={styles.product_name}>{product.name}</span>
                    <span className={styles.product_price}>
                      {Number(product.cost).toLocaleString("vi-VN")}
                    </span>
                  </div>
                  <span className={styles.product_description}>
                    {product.type}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetail;
