import backGround from "../../assets/images/banner-giay-da-bong-nike.webp";
import "../../components/GlobalStyles/GlobalStyles.scss";
import styles from "./Service.module.scss";
import clsx from "clsx";

function Service() {
  return (
    <div className={styles.wrapper}>
      {/* Hero Section */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay}></div>
        <img
          src={backGround}
          alt="Shoe Cleaning Service"
          className={styles.heroImg}
        />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Premium Shoe Care</h1>
          <p className={styles.heroSubtitle}>
            Professional Cleaning & Warranty Services
          </p>
        </div>
      </div>

      <div className={clsx("container", styles.container)}>
        {/* Intro */}
        <div className={styles.intro}>
          <h2 className={styles.sectionTitle}>Shoe Cleaning Service</h2>
          <p className={styles.desc}>
            We are committed to delivering the best shopping experience through
            a diverse product range, stylish designs, modern and luxurious
            stores, and continuously improved after-sales services. Accordingly,
            we have upgraded and implemented a warranty policy applicable to all
            customers purchasing at our nationwide store system and through our
            website.
          </p>
        </div>

        {/* Policy Grid */}
        <div className={styles.policyGrid}>
          {/* Card 1: Applicable Products */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <i className="fa-solid fa-layer-group"></i>
              <h3>Applicable Categories</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                Our warranty policy applies to all products purchased at our
                stores or through our official website:
              </p>
              <ul className={styles.checkList}>
                <li>Shoes & Sandals</li>
                <li>Belts</li>
                <li>Handbags & Wallets</li>
              </ul>
              <div className={styles.note}>
                <i className="fa-solid fa-circle-info"></i>
                <p>
                  For manufacturing defects, the exchange policy will be
                  applied. Kindly refer to our Product Exchange Policy.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Warranty Conditions */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <i className="fa-solid fa-shield-halved"></i>
              <h3>Free Warranty Conditions</h3>
            </div>
            <div className={styles.cardBody}>
              <p>
                Customers are entitled to <strong>free warranty service</strong>{" "}
                for:
              </p>
              <ul className={styles.checkList}>
                <li>Detached adhesive (Keo bong)</li>
                <li>Loose stitching (Sứt chỉ)</li>
                <li>Dry or cracked adhesive</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Detailed Conditions Section */}
        <div className={styles.detailsSection}>
          <h3 className={styles.sectionTitle}>Detailed Terms</h3>

          <div className={styles.termsGrid}>
            <div className={clsx(styles.termBox, styles.valid)}>
              <h4>
                <i className="fa-solid fa-check"></i> Eligible Cases
              </h4>
              <p>
                Warranty applies to products included in the applicable product
                categories listed above that encounter the technical issues
                mentioned (adhesive, stitching).
              </p>
            </div>

            <div className={clsx(styles.termBox, styles.invalid)}>
              <h4>
                <i className="fa-solid fa-xmark"></i> Non-Eligible Cases
              </h4>
              <ul>
                <li>Products not purchased from SevenStore.</li>
                <li>
                  Wear and tear: Worn-out soles, broken heels, scratches,
                  damaged leather from impact.
                </li>
                <li>
                  Improper storage: Chemical discoloration, dry/hardened leather
                  due to long-term lack of use, aging due to environment.
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Duration Banner */}
        <div className={styles.durationBanner}>
          <div className={styles.durationContent}>
            <h3>Warranty Duration</h3>
            <p>
              Processing time: up to <strong>05 working days</strong> from
              receipt.
            </p>
          </div>
          <button className={styles.contactBtn}>Contact Support</button>
        </div>
      </div>
    </div>
  );
}

export default Service;
