import styles from "./Header.module.scss";
import clsx from "clsx";
import "../../../GlobalStyles/GlobalStyles.scss";
import { Link } from "react-router-dom";
import { useState } from "react";
import noItem from "../../../../assets/images/no-item.jpg";

function Header() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <header className={clsx(styles.header)}>
        <div className={clsx("wrapper", styles.header_top)}>
          <Link to="/" className={clsx(styles.logo)}>
            SEVENSTORE
          </Link>
        </div>
      </header>
      <nav className={clsx(styles.navbar)}>
        <div className={clsx(styles.nav_left)}>
          <ul className={clsx(styles.nav_list, open && styles.show)}>
            <li>
              <Link className={clsx(styles.nav_item)} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className={clsx(styles.nav_item)} to="/">
                NEW ARRIVALS
              </Link>
            </li>
            <li className={clsx(styles.nav_item, styles.nav_brands)}>
              Brands
              <i className="fa-solid fa-caret-down"></i>
              <ul className={clsx(styles.nav_list_brands)}>
                <li>
                  <Link
                    to="/product/puma"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Puma
                  </Link>
                </li>

                <li>
                  <Link
                    to="/product/nike"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Nike
                  </Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Bape</Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Adidas</Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>
                    New Balence
                  </Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>
                    Onitsuka Tiger
                  </Link>
                </li>

                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Converse</Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Vans</Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Asics</Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Rebok</Link>
                </li>
                <li>
                  <Link className={clsx(styles.nav_item_brands)}>Salomon</Link>
                </li>
                <li>
                  <Link
                    to="/product/all"
                    className={clsx(
                      styles.nav_item_brands,
                      styles.nav_item_primary
                    )}
                  >
                    All
                  </Link>
                </li>
              </ul>
            </li>
            <li>
              <Link className={clsx(styles.nav_item)} to="/">
                SERVICES
              </Link>
            </li>
            <li>
              <Link className={clsx(styles.nav_item)} to="/">
                ABOUT US
              </Link>
            </li>
            <li>
              <Link className={clsx(styles.nav_item)} to="/">
                CONTACT
              </Link>
            </li>
            <li>
              <Link
                className={clsx(styles.nav_item, styles.nav_item_primary)}
                to="/"
              >
                Sale Up to 50%
              </Link>
            </li>

            <li>
              <Link className={clsx(styles.nav_item)} to="/dashboard/employee">
                Dashboard
              </Link>
            </li>
          </ul>

          <div className={clsx(styles.nav_left_icon)}>
            <button
              className={clsx(styles.btn_menu)}
              onClick={() => setOpen(!open)}
            >
              <i className={clsx("fa-solid fa-bars")}></i>
            </button>
            <button className={clsx(styles.mobile_btn_search)}>
              <i className={clsx("fa-solid fa-magnifying-glass")}></i>
            </button>
          </div>
        </div>

        <div className={clsx(styles.nav_right)}>
          <div className={clsx(styles.nav_search)}>
            <input
              className={clsx(styles.nav_search_input)}
              placeholder="Tìm kiếm sản phẩm  "
            />
            <i
              className={clsx(
                "fa-solid fa-magnifying-glass",
                styles.nav_search_icon
              )}
            ></i>
          </div>
          <div className={clsx(styles.header_cart)}>
            <i className="fa-solid fa-cart-shopping"></i>

            <div className={clsx(styles.header_cart_wrapper)}>
              <h4 className={clsx(styles.heading_cart)}>Sản phẩm đã thêm</h4>
              <div className={clsx(styles.cart_no_item)}>
                <img
                  className={clsx(styles.img_cart_no_item)}
                  src={noItem}
                  alt="noitem"
                />
                <span>Chưa có sản phẩm nào</span>
              </div>
            </div>
          </div>
          <div className={clsx(styles.header_user)}>
            <i className="fa-regular fa-user"></i>

            <ul className={styles.user_list}>
              <li className={styles.user_title}>Liên kết nhanh</li>
              <li>
                <Link className={styles.user_item}>Thông tin của tôi</Link>
              </li>
              <li>
                <Link className={styles.user_item}>Danh sách yêu thích</Link>
              </li>
              <li>
                <Link className={styles.user_item}>Hỗ trợ</Link>
              </li>
              <li>
                <Link className={clsx(styles.user_login, styles.user_item)}>
                  Đăng nhập
                </Link>
              </li>
              <li className={styles.user_title}>
                Bạn chưa có tài khoản ?
                <Link className={clsx(styles.user_register)}>
                  Đăng ký tại đây
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
