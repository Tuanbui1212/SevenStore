import styles from "./Footer.module.scss";
import clsx from "clsx";
import "../../../GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";

import Visa from "../../../../assets/images/ListItemSVG.png";
import PayPal from "../../../../assets/images/ListItemSVG-2.png";
import Skrill from "../../../../assets/images/ListItemSVG-3.png";
import Klarna from "../../../../assets/images/ListItemSVG-4.png";

import Facebook from "../../../../assets/images/facebook.png";
import X from "../../../../assets/images/x.png";
import Instagram from "../../../../assets/images/instagram.png";
import In from "../../../../assets/images/in.png";

const PAYMENT_METHODS = [
  { id: 1, src: Visa, name: "Visa" },
  { id: 2, src: PayPal, name: "PayPal" },
  { id: 3, src: Skrill, name: "Skrill" },
  { id: 4, src: Klarna, name: "Klarna" },
];

const SOCIAL_LINKS = [
  { id: 1, src: Facebook, name: "Facebook", href: "#" },
  { id: 2, src: X, name: "X", href: "#" },
  { id: 3, src: Instagram, name: "Instagram", href: "#" },
  { id: 4, src: In, name: "LinkedIn", href: "#" },
];

const QUICK_LINKS = [
  { label: "Home", to: "/" },
  { label: "New Arrivals", to: "/product/NEW ARRIVALS" },
  { label: "Sale", to: "/product/sale" },
  { label: "All Brands", to: "/product/all" },
  { label: "My Orders", to: "/my-orders" },
  { label: "Help Center", to: "/help" },
];

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className="container">
        <div className={clsx("row", styles.footer__main)}>
          {/* Col 1: Brand */}
          <div className={clsx("col col-4 col-sm-12", styles.footer__brand)}>
            <h2 className={styles.footer__logo}>SEVENSTORE</h2>
            <p className={styles.footer__tagline}>
              Premium sneakers for every style.
            </p>
            <div className={styles.footer__social}>
              {SOCIAL_LINKS.map((s) => (
                <a key={s.id} href={s.href} aria-label={s.name}>
                  <img src={s.src} alt={s.name} />
                </a>
              ))}
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className={clsx("col col-4 col-sm-12", styles.footer__links)}>
            <h4 className={styles.footer__heading}>Quick Links</h4>
            <ul>
              {QUICK_LINKS.map((link) => (
                <li key={link.to}>
                  <Link to={link.to}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className={clsx("col col-4 col-sm-12", styles.footer__contact)}>
            <h4 className={styles.footer__heading}>Contact Us</h4>
            <div className={styles.footer__contact_item}>
              <i className="fa-solid fa-phone"></i>
              <span>098 432 6877</span>
            </div>
            <div className={styles.footer__contact_item}>
              <i className="fa-solid fa-envelope"></i>
              <span>tuanbui122003@gmail.com</span>
            </div>
            <div className={styles.footer__contact_item}>
              <i className="fa-solid fa-location-dot"></i>
              <span>Hà Nội, Việt Nam</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={clsx("row", styles.footer__bottom)}>
          <div className={clsx("col col-6 col-sm-12", styles.footer__copy)}>
            <p>© 2024 SeventStore. All rights reserved.</p>
            <div className={styles.footer__payment}>
              {PAYMENT_METHODS.map((p) => (
                <img key={p.id} src={p.src} alt={p.name} />
              ))}
            </div>
          </div>
          <div className={clsx("col col-6 col-sm-12", styles.footer__policy)}>
            <Link to="#">Terms & Conditions</Link>
            <Link to="#">Privacy Policy</Link>
            <Link to="#">Order Tracking</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
