import styles from "./Header.module.scss";
import clsx from "clsx";
import "../../../GlobalStyles/GlobalStyles.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import noItem from "../../../../assets/images/no-item.jpg";
import axios from "../../../../util/axios";

function Header() {
  const navigate = useNavigate();
  const fullUrl = window.location.href;

  const [openMenu, setOpenMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [carts, setCarts] = useState([]);
  const [search, setSearch] = useState("");

  const success = localStorage.getItem("success");
  const role = localStorage.getItem("role");

  const searchInputRef = useRef(null);

  const fetchCart = () => {
    const user = localStorage.getItem("user");
    if (!user) return;

    let url = `/cart?user=${encodeURIComponent(user)}`;

    axios
      .get(url)
      .then((res) => {
        setCarts(res.data.cart || []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setOpenMenu(false);
    setShowSearch(false);
  }, [fullUrl]);

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (showSearch && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [showSearch]);

  const handleSearch = () => {
    if (!search) return;
    navigate(`/search?value=${search}`);
    setSearch("");
    setShowSearch(false);
  };

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
          <div className={clsx(styles.nav_left_icon)}>
            <button
              className={clsx(styles.btn_menu)}
              onClick={() => setOpenMenu(!openMenu)}
            >
              <i className={clsx("fa-solid fa-bars")}></i>
            </button>
          </div>

          <ul className={clsx(styles.nav_list, openMenu && styles.show)}>
            <li>
              <Link className={clsx(styles.nav_item)} to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className={clsx(styles.nav_item)}
                to="/product/NEW ARRIVALS"
              >
                NEW ARRIVALS
              </Link>
            </li>

            <li className={clsx(styles.nav_item, styles.nav_brands)}>
              Brands{" "}
              <i
                className="fa-solid fa-caret-down"
                style={{ marginLeft: "5px" }}
              ></i>
              <ul className={clsx(styles.nav_list_brands)}>
                {[
                  "Puma",
                  "Nike",
                  "Bape",
                  "Adidas",
                  "New Balance",
                  "Onitsuka Tiger",
                  "Converse",
                  "Vans",
                  "Asics",
                  "Reebok",
                  "Salomon",
                ].map((brand) => (
                  <li key={brand}>
                    <Link
                      to={`/product/${brand.toLowerCase().replace(" ", "-")}`}
                      className={clsx(styles.nav_item_brands)}
                    >
                      {brand}
                    </Link>
                  </li>
                ))}
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
              <Link to="/service" className={clsx(styles.nav_item)}>
                SERVICES
              </Link>
            </li>
            <li>
              <Link className={clsx(styles.nav_item)} to="/aboutUs">
                ABOUT US
              </Link>
            </li>
            <li>
              <Link
                className={clsx(styles.nav_item, styles.nav_item_primary)}
                to="/product/sale"
              >
                Sale Up to 50%
              </Link>
            </li>
          </ul>
        </div>

        <div className={clsx(styles.nav_right)}>
          <div
            className={clsx(
              styles.nav_search,
              showSearch && styles.show_mobile_search
            )}
          >
            <input
              ref={searchInputRef}
              className={clsx(styles.nav_search_input)}
              placeholder="Search items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              className={clsx(styles.nav_search_icon)}
              onClick={handleSearch}
            >
              <i className={clsx("fa-solid fa-magnifying-glass")}></i>
            </button>
          </div>

          <button
            className={clsx(styles.mobile_search_btn)}
            onClick={() => setShowSearch(!showSearch)}
          >
            <i
              className={clsx(
                "fa-solid",
                showSearch ? "fa-xmark" : "fa-magnifying-glass"
              )}
            ></i>
          </button>

          <div className={clsx(styles.header_cart)} onMouseEnter={fetchCart}>
            <i className="fa-solid fa-cart-shopping"></i>
            {carts.length > 0 && (
              <span className={styles.cart_badge}>{carts.length}</span>
            )}

            <div className={clsx(styles.header_cart_wrapper)}>
              <h4 className={clsx(styles.heading_cart)}>Added products</h4>
              <div className={clsx(styles.cart_no_item)}>
                {carts && carts.length > 0 ? (
                  <ul className={clsx(styles.cartList)}>
                    {carts.map((item, index) => (
                      <Link
                        to={`/product/${item.brand}/${item.slug}`}
                        key={index}
                        className={clsx(styles.cartItem)}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          className={clsx(styles.cartImg)}
                        />
                        <div className={clsx(styles.cartInfo)}>
                          <div className={clsx(styles.cartInfoLeft)}>
                            <span className={clsx(styles.cartName)}>
                              {item.name}
                            </span>
                            <span className={clsx(styles.cartSize)}>
                              Size: {item.size?.replace("size", "")}
                            </span>
                            <span className={clsx(styles.cartQuantity)}>
                              SL: {item.quantity}
                            </span>
                          </div>
                          <div className={clsx(styles.cartInfoRight)}>
                            <span className={clsx(styles.cartPrice)}>
                              {Number(item.cost).toLocaleString("vi-VN")} ₫
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </ul>
                ) : (
                  <>
                    <img
                      className={clsx(styles.img_cart_no_item)}
                      src={noItem}
                      alt="noitem"
                    />
                    <span>No products added yet</span>
                  </>
                )}
              </div>
              <Link to={"/cart"} className={clsx(styles.link_cart)}>
                View cart
              </Link>
            </div>
          </div>

          <div className={clsx(styles.header_user)}>
            <i className="fa-regular fa-user"></i>
            <ul className={styles.user_list}>
              <li className={styles.user_title}>Account Menu</li>
              {success && (
                <>
                  <li>
                    <Link to={"/myAccount"} className={styles.user_item}>
                      My Account
                    </Link>
                  </li>
                  <li>
                    <Link to={"/my-orders"} className={styles.user_item}>
                      My Orders
                    </Link>
                  </li>
                </>
              )}
              {success && role === "admin" && (
                <li>
                  <Link className={styles.user_item} to="/dashboard">
                    Dashboard
                  </Link>
                </li>
              )}
              <li>
                <Link to={"/help"} className={styles.user_item}>
                  Help Center
                </Link>
              </li>
              {!success ? (
                <>
                  <li>
                    <Link
                      to={"/login"}
                      className={clsx(styles.user_login, styles.user_item)}
                    >
                      Login
                    </Link>
                  </li>
                  <li className={styles.user_title}>
                    Not a member?{" "}
                    <Link to="/login" className={clsx(styles.user_register)}>
                      Join Us
                    </Link>
                  </li>
                </>
              ) : (
                <li>
                  <Link
                    to={"/login"}
                    className={clsx(styles.user_login, styles.user_item)}
                    onClick={() => localStorage.clear()}
                  >
                    Log Out
                  </Link>
                </li>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Header;
