import backGround from "../../assets/images/banner-giay-da-bong-nike.webp";
import "../../components/GlobalStyles/GlobalStyles.scss";
import styles from "./Service.module.scss";
import clsx from "clsx";

function Service() {
  return (
    <div className={styles.container}>
      <div className={styles.bannerWrapper}>
        <img
          src={backGround}
          alt="Dịch vụ vệ sinh giày"
          className={styles.bannerImg}
        />
      </div>

      <div className={styles.content}>
        <h2 className={styles.title}>Shoe Cleaning Service</h2>

        <p className={styles.desc}>
          We are committed to delivering the best shopping experience through a
          diverse product range, stylish designs, modern and luxurious stores,
          and continuously improved after-sales services. Accordingly, we have
          upgraded and implemented a warranty policy applicable to all customers
          purchasing at our nationwide store system and through our website.
        </p>

        <h3 className={styles.subtitle}>Applicable Product Categories</h3>

        <ul className={clsx(styles.list, styles.textList)}>
          <li>
            Our warranty policy applies to all products purchased at our stores
            or through our official website, including:
          </li>
          <li>Shoes</li>
          <li>Sandals</li>
          <li>Belts</li>
          <li>Handbags</li>
          <li>Wallets</li>
          <li>
            In cases where the product is faulty due to manufacturing defects,
            the exchange policy will be applied. Kindly refer to our Product
            Exchange Policy for further details.
          </li>
        </ul>

        <h3 className={styles.subtitle}>Warranty Policy</h3>

        <p className={styles.desc}>
          Customers purchasing products from us are entitled to{" "}
          <strong>free warranty service</strong>
          under the following conditions:
        </p>

        <ul className={clsx(styles.list, styles.textList)}>
          <li>Detached adhesive</li>
          <li>Loose stitching</li>
          <li>Dry or cracked adhesive</li>
        </ul>

        <h3 className={styles.subtitle}>Warranty Conditions</h3>

        <ul className={clsx(styles.list, styles.textList)}>
          <li>
            <strong>Eligible warranty cases:</strong>
          </li>
          <li>
            Warranty applies to products included in the applicable product
            categories listed above.
          </li>

          <li>
            <strong>
              Warranty will not be applied in the following cases:
            </strong>
          </li>
          <li>
            Products that are not purchased at our stores or not within the
            applicable product categories
          </li>
          <li>
            Used footwear showing wear such as worn-out soles, broken soles,
            impacts causing scratches, broken heels, damaged leather, etc.
          </li>
          <li>
            Improper storage such as applying chemicals causing discoloration,
            leather fading, long-term lack of use resulting in decomposition,
            dry or hardened leather, aging adhesives, etc.
          </li>
        </ul>

        <h3 className={styles.subtitle}>Warranty Duration</h3>

        <p className={styles.desc}>
          Once we receive the product for warranty service, the processing time
          will take up to
          <strong> 05 working days</strong>.
        </p>
      </div>
    </div>
  );
}

export default Service;
