import styles from "./Footer.module.scss";
import clsx from "clsx";
import "../../../GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";

import Visa from "../../../../assets/images/ListItemSVG.png";
import PayPal from "../../../../assets/images/ListItemSVG-2.png";
import Skrill from "../../../../assets/images/ListItemSVG-3.png";
import Klarna from "../../../../assets/images/ListItemSVG-4.png";

import Google from "../../../../assets/images/apple-store-button-dark.png.png";
import Apple from "../../../../assets/images/google-play-button-dark.png.png";

import Facebook from "../../../../assets/images/facebook.png";
import X from "../../../../assets/images/x.png";
import Instagram from "../../../../assets/images/instagram.png";
import In from "../../../../assets/images/in.png";

function Footer() {
  const listPay = [
    { id: 1, src: Visa, name: "Visa" },
    { id: 2, src: PayPal, name: "PayPal" },
    { id: 3, src: Skrill, name: "Skrill" },
    { id: 4, src: Klarna, name: "Klarna" },
  ];

  const listSocial = [
    { id: 1, src: Facebook, name: "Facebook" },
    { id: 2, src: X, name: "X" },
    { id: 3, src: Instagram, name: "instagram" },
    { id: 4, src: In, name: "In" },
  ];

  return (
    <>
      <div className={clsx(styles.footer)}>
        <div className={clsx("container")}>
          <div className={clsx("row", styles.footer__top)}>
            <div className={clsx("col", "col-6")}>
              <h3 className={styles.footer__title}>
                Join our newsletter for £10 off
              </h3>
              <p className={styles.footer__desc}>
                Register now to get the latest updates on promotions & coupons.
                Don’t worry, we don’t spam!
              </p>
            </div>

            <div className={clsx("col", "col-6", styles.footer__form)}>
              <form>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className={styles.footer__input}
                />
                <button type="submit" className={styles.footer__btn}>
                  SEND
                </button>
              </form>
            </div>
          </div>

          <div className={clsx("row", styles.footer__content)}>
            <div className={clsx("col", "col-4")}>
              <h3>Do You Need Help ?</h3>
              <div>
                <div className={clsx(styles.help)}>
                  <i className="fa-solid fa-phone"></i>
                  <p>098 432 6877</p>
                </div>

                <div className={clsx(styles.help)}>
                  <i className="fa-solid fa-envelope"></i>
                  <p>tuanbui122003@gmail.com</p>
                </div>
              </div>
            </div>
            <div className={clsx("col", "col-4")}>
              <h3>Download our app</h3>
              <div className={clsx("row")}>
                <img src={Apple} alt="" className={clsx("col", "col-6")} />
                <img src={Google} alt="" className={clsx("col", "col-6")} />
              </div>
            </div>
            <div className={clsx("col", "col-4")}>
              <h3>Follow us on social media:</h3>
              <div className={clsx("row")}>
                {listSocial.map((social) => (
                  <img
                    key={social.id}
                    src={social.src}
                    alt=""
                    className={clsx("col", "col-2")}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className={clsx("row", styles.footer__bottom)}>
            <div className={clsx("col", "col-8")}>
              <p>
                Copyright 2024 © Jinstore WooCommerce WordPress Theme. All right
                reserved. Powered by BlackRise Themes.
              </p>
              <div className={clsx(styles.footer__img)}>
                {listPay.map((item) => (
                  <img key={item.id} src={item.src} alt={item.name} />
                ))}
              </div>
            </div>

            <div className={clsx("col", "col-4", styles.list__links)}>
              <Link to="#" className={clsx(styles.link)}>
                Terms and Conditions
              </Link>
              <Link to="#" className={clsx(styles.link)}>
                Privacy Policy
              </Link>
              <Link to="#" className={clsx(styles.link)}>
                Order Tracking
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Footer;
