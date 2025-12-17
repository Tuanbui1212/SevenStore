import clsx from "clsx";
import styles from "./AboutUs.module.scss";
// Bạn hãy thay thế bằng ảnh thật của shop hoặc ảnh giày đẹp
import aboutImg from "../../assets/images/slider01.png";

export default function AboutUs() {
  return (
    <div className={styles.aboutUs}>
      <div className={clsx("container", styles.container)}>
        {/* Phần 1: Giới thiệu chung */}
        <div className={styles.heroSection}>
          <div className={styles.contentLeft}>
            <h1 className={styles.title}>About SevenStore</h1>
            <p className={styles.desc}>
              SevenStore is dedicated to elevating footwear fashion for sneaker
              lovers. We provide premium shoes and professional cleaning
              services to ensure every pair always looks its best.
            </p>
            <p className={styles.desc}>
              Customer satisfaction is our top priority — we strive to deliver a
              seamless, enjoyable shopping experience both in-store and online.
            </p>
          </div>
          <div className={styles.contentRight}>
            <img
              src={aboutImg}
              alt="About SevenStore"
              className={styles.heroImage}
            />
          </div>
        </div>

        {/* Phần 2: Mission & Vision */}
        <div className={styles.missionSection}>
          <div className={styles.card}>
            <h2 className={styles.subtitle}>Our Mission</h2>
            <p className={styles.cardDesc}>
              To offer high-quality footwear at the best value, while providing
              exceptional care for every customer and every pair of shoes.
            </p>
          </div>
          <div className={styles.card}>
            <h2 className={styles.subtitle}>Our Vision</h2>
            <p className={styles.cardDesc}>
              To become the leading destination for premium shoes and
              professional shoe care services – trusted by every sneaker
              enthusiast.
            </p>
          </div>
        </div>

        {/* Phần 3: Core Values & Stats */}
        <div className={styles.valuesSection}>
          <h2 className={styles.subtitle}>Core Values</h2>
          <div className={styles.valuesGrid}>
            <div className={styles.valueItem}>
              <i className="fa-solid fa-gem"></i>
              <h3>Premium Quality</h3>
            </div>
            <div className={styles.valueItem}>
              <i className="fa-solid fa-fire"></i>
              <h3>Trendy Styles</h3>
            </div>
            <div className={styles.valueItem}>
              <i className="fa-solid fa-heart"></i>
              <h3>Customer First</h3>
            </div>
            <div className={styles.valueItem}>
              <i className="fa-solid fa-tag"></i>
              <h3>Fair Pricing</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
