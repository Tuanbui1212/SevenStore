import { useState, useEffect, useRef } from "react";
import styles from "./Home.module.scss";
import clsx from "clsx";
import "../../components/GlobalStyles/GlobalStyles.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../util/axios";

import slider01 from "../../assets/images/slider01.png";
import slider02 from "../../assets/images/slider02.png";
import slider03 from "../../assets/images/slider03.png";

import nike from "../../assets/images/nike_snaker.png";
import running from "../../assets/images/running.png";
import basketball from "../../assets/images/basketball.png";
import soccer from "../../assets/images/soccer.png";
import sale_img from "../../assets/images/Sale-img.png";

import nike_img from "../../assets/images/6.png";
import bape_img from "../../assets/images/7.png";
import newBalance_img from "../../assets/images/8.png";
import adidas_img from "../../assets/images/9.png";
import tiger_img from "../../assets/images/10.png";
import converse_img from "../../assets/images/11.png";
import vans_img from "../../assets/images/12.png";
import asics_img from "../../assets/images/13.png";
import puma_img from "../../assets/images/14.png";
import reebok_img from "../../assets/images/15.png";

function Home() {
  const [imageIndex, setImageIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const [products, setProducts] = useState([]);
  const scrollRef = useRef(null);
  const scrollRefBrand = useRef(null);
  const navigate = useNavigate();

  const images = [slider01, slider02, slider03];

  const brands = [
    { name: "nike", image: nike_img },
    { name: "bape", image: bape_img },
    { name: "new balance", image: newBalance_img },
    { name: "adidas", image: adidas_img },
    { name: "tiger", image: tiger_img },
    { name: "converse", image: converse_img },
    { name: "vans", image: vans_img },
    { name: "asics", image: asics_img },
    { name: "puma", image: puma_img },
    { name: "reebok", image: reebok_img },
  ];

  const scrollLeft = () => {
    scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  const scrollLeftBrand = () => {
    scrollRefBrand.current.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRightBrand = () => {
    scrollRefBrand.current.scrollBy({ left: 300, behavior: "smooth" });
  };

  useEffect(() => {
    axios
      .get(`/`)
      .then((response) => {
        setProducts(response.data.newProduct);
      })
      .catch((err) => console.error(err));
  }, []);

  function changeImage(direction) {
    setIsFading(true);

    setTimeout(() => {
      setImageIndex((prevIndex) => {
        let newIndex = prevIndex + direction;
        if (newIndex < 0) newIndex = images.length - 1;
        if (newIndex >= images.length) newIndex = 0;
        return newIndex;
      });

      setIsFading(false);
    }, 500);
  }

  useEffect(() => {
    const interval = setInterval(() => {
      changeImage(1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={clsx("container")}>
      {products.length === 0 && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingModal}>
            <div className={styles.spinner}></div>
            <h3>Đang tải dữ liệu...</h3>
            <p>Vui lòng chờ trong giây lát để cập nhật sản phẩm mới nhất.</p>
          </div>
        </div>
      )}

      <div className={clsx("row", styles.slider)}>
        <button
          className={clsx(styles.slider_btn, styles.slider_btn_pre)}
          onClick={() => changeImage(-1)}
        >
          &#10094;
        </button>
        <div className={clsx("col", "col-12", styles.slider_img)}>
          <img
            src={images[imageIndex]}
            alt="Sneaker"
            className={clsx(styles.sliderImage, isFading && styles.fadeOut)}
          />
        </div>
        <button
          className={clsx(styles.slider_btn, styles.slider_btn_next)}
          onClick={() => changeImage(1)}
        >
          &#10095;
        </button>
      </div>

      <div className={clsx("row", styles.content)}>
        <span className={clsx("col", "col-12", styles.title)}>
          NEW ARRIVALS
        </span>
      </div>

      <div className={clsx("row", styles.new_prouct)}>
        {/* Trai */}
        <button
          onClick={scrollLeft}
          className={clsx(
            "slider_btn",
            "slider_btn_pre",
            styles.btn,
            styles.btn_left
          )}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div ref={scrollRef} className={clsx(styles.list_new_product)}>
          {products.map((product, index) => (
            <Link
              key={index}
              to={`/product/${product.brand}/${product.slug}`}
              className={clsx(
                "col",
                "col-3",
                "col-md-4",
                "col-sm-5",
                styles.product_item
              )}
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
        {/* Phai */}
        <button
          onClick={scrollRight}
          className={clsx(
            "slider_btn",
            "slider_btn_next",
            styles.btn,
            styles.btn_right
          )}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      <div className={clsx("row", "no-gutters", styles.content)}>
        <div className={clsx(styles.finder)}>
          <div
            className={clsx(
              "col",
              "col-6",
              "col-lg-8",
              "col-md-12",
              "col-sm-12",
              styles.finder__content
            )}
          >
            <h3>NIKE RUNNING SHOE FINDER</h3>
            <span>
              Answer a few questions and we'll help you find the perfect pair.
            </span>
            <button>GET START</button>
          </div>
          <img
            className={clsx(
              "col",
              "col-6",
              "col-lg-4",
              "display-md-none",
              "display-sm-none",
              styles.finder__image
            )}
            src={nike}
            alt=""
          />
        </div>
      </div>

      <div className={clsx("row", styles.content)}>
        <span
          className={clsx("col", "col-12", styles.title, styles.title__center)}
        >
          GEAR THAT'S MADE TO MOVE
        </span>
      </div>

      <div className={clsx("row", styles.sport)}>
        <div className={clsx("col", "col-4", "col-sm-12")}>
          <img src={basketball} alt="" />
          <p>NEW IN BASKETBALL</p>
        </div>
        <div className={clsx("col", "col-4", "col-sm-12")}>
          <img src={running} alt="" />
          <p>NEW IN RUNNING</p>
        </div>
        <div className={clsx("col", "col-4", "col-sm-12")}>
          <img src={soccer} alt="" />
          <p>NEW IN SOCCER</p>
        </div>
      </div>

      <div className={clsx("row", styles.sale_img, styles.content)}>
        <img className={clsx("col", "col-12")} src={sale_img} alt="" />
        <div className={clsx(styles.sale_title)}>
          <h3>UP TO 70% OFF END OF SEASON SALE</h3>
          <p>+ Extra 15% Off with code: Seven</p>
        </div>
        <button onClick={() => navigate("/product/sale")}>SHOW NOW</button>
      </div>

      <div className={clsx("row", styles.content)}>
        <span
          className={clsx("col", "col-12", styles.title, styles.title__center)}
        >
          BRANDs
        </span>
      </div>

      <div className={clsx("row", styles.new_prouct)}>
        {/* Trai */}
        <button
          onClick={scrollLeftBrand}
          className={clsx(
            "slider_btn",
            "slider_btn_pre",
            styles.btn,
            styles.btn_left
          )}
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <div ref={scrollRefBrand} className={clsx(styles.list_new_product)}>
          {brands.map((img_brand) => (
            <Link
              to={`/product/${img_brand.name}`}
              key={img_brand.name}
              className={clsx(
                "col",
                "col-2",
                "col-md-3",
                "col-sm-5",
                styles.product_item
              )}
            >
              <img
                src={img_brand.image}
                alt="Sneaker"
                className={styles.product_img}
              />
            </Link>
          ))}
        </div>
        {/* Phai */}
        <button
          onClick={scrollRightBrand}
          className={clsx(
            "slider_btn",
            "slider_btn_next",
            styles.btn,
            styles.btn_right
          )}
        >
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}

export default Home;
