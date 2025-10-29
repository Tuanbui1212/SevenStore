import clsx from "clsx";
import styles from "./AboutUs.module.scss";

export default function AboutUs() {
  return (
    <div className={styles.aboutUs}>
      <div className={styles.container}>
        <h1 className={styles.title}>About SevenStore</h1>

        <p className={styles.desc}>
          SevenStore is dedicated to elevating footwear fashion for sneaker
          lovers. We provide premium shoes and professional cleaning services to
          ensure every pair always looks its best. Customer satisfaction is our
          top priority — we strive to deliver a seamless, enjoyable shopping
          experience both in-store and online.
        </p>

        <h2 className={styles.subtitle}>Our Mission</h2>
        <p className={styles.desc}>
          To offer high-quality footwear at the best value, while providing
          exceptional care for every customer and every pair of shoes.
        </p>

        <h2 className={styles.subtitle}>Our Vision</h2>
        <p className={styles.desc}>
          To become the leading destination for premium shoes and professional
          shoe care services – trusted by every sneaker enthusiast.
        </p>

        <h2 className={styles.subtitle}>Core Values</h2>
        <ul className={clsx(styles.list, styles.textList)}>
          <li>Premium Quality</li>
          <li>Modern & Trendy Styles</li>
          <li>Customer-first Experience</li>
          <li>Affordable & Fair Pricing</li>
        </ul>
      </div>
    </div>
  );
}
