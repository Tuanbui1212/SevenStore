import styles from "./Header.module.scss";
import clsx from "clsx";
import "../../../GlobalStyles/GlobalStyles.scss";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import noItem from "../../../../assets/images/no-item.jpg";
import axios from "../../../../util/axios";

function Header() {
  const navigate = useNavigate();

  const fullUrl = window.location.href;

  const [open, setOpen] = useState(false);
  const [carts, setCarts] = useState({});

  const [search, setSearch] = useState("");
  const success = localStorage.getItem("success");
  const role = localStorage.getItem("role");

  const fetchCart = () => {
    const user = localStorage.getItem("user");

    if (!user) return;
    //let url = `http://localhost:5000/cart?`;
    let url = `/cart?`;

    if (user) url += `user=${encodeURIComponent(user)}`;

    // fetch(url)
    //   .then((res) => res.json())
    axios
      .get(url)
      .then((res) => {
        setCarts(res.data.cart || []);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setOpen(false);
  }, [fullUrl]);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleSearch = () => {
    if (!search) return;
    navigate(`/search?value=${search}`);
    setSearch("");
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
          <ul className={clsx(styles.nav_list, open && styles.show)}>
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
                  <Link
                    to="/product/bape"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Bape
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/adidas"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Adidas
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/new-balance"
                    className={clsx(styles.nav_item_brands)}
                  >
                    New Balance
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/onitsuka-tiger"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Onitsuka Tiger
                  </Link>
                </li>

                <li>
                  <Link
                    to="/product/converse"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Converse
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/vans"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Vans
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/asics"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Asics
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/rebok"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Rebok
                  </Link>
                </li>
                <li>
                  <Link
                    to="/product/salomon"
                    className={clsx(styles.nav_item_brands)}
                  >
                    Salomon
                  </Link>
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
              placeholder="Search items"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
            />
            <button
              className={clsx(styles.nav_search_icon)}
              onClick={() => {
                handleSearch();
              }}
            >
              <i className={clsx("fa-solid fa-magnifying-glass")}></i>
            </button>
          </div>

          {/* Cart */}
          <div className={clsx(styles.header_cart)} onMouseEnter={fetchCart}>
            <i className="fa-solid fa-cart-shopping"></i>

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
                              Size: {item.size.replace("size", "")}
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
                {" "}
                View cart{" "}
              </Link>
            </div>
          </div>

          <div className={clsx(styles.header_user)}>
            <i className="fa-regular fa-user"></i>

            <ul className={styles.user_list}>
              {/* Đổi "Liên kết nhanh" thành Account Menu hoặc Quick Actions */}
              <li className={styles.user_title}>Account Menu</li>

              <li>
                <Link to={"/"} className={styles.user_item}>
                  My Account
                </Link>
              </li>

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

              {!success && (
                <li>
                  <Link
                    to={"/login"}
                    className={clsx(styles.user_login, styles.user_item)}
                  >
                    Login
                  </Link>
                </li>
              )}

              {success && (
                <li>
                  <Link
                    to={"/login"}
                    className={clsx(styles.user_login, styles.user_item)}
                    onClick={() => {
                      localStorage.clear();
                    }}
                  >
                    Log Out
                  </Link>
                </li>
              )}

              {!success && (
                <li className={styles.user_title}>
                  Not a member?
                  <Link to="/login" className={clsx(styles.user_register)}>
                    Join Us
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
