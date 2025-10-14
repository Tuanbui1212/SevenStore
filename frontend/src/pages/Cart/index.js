import styles from "./Cart.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";
import noItem from "../../assets/images/no-item.jpg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [carts, setCarts] = useState([]);
  const [quantity, setQuantity] = useState([]);

  const fetchCart = () => {
    const user = localStorage.getItem("user");

    if (!user) return;
    let url = `http://localhost:5000/cart?`;

    if (user) url += `user=${encodeURIComponent(user)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCarts(data.cart || []);
        setQuantity(data.cart.quantity);
        console.log(data.cart);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className={clsx("container", styles.cartContainer)}>
      <div className="row">
        <div className="col col-9">
          <div className={styles.selectAll}>
            <input type="checkbox" />
            <span>All</span>
          </div>

          {/* List of products */}
          <div className={styles.cartList}>
            {/* Item */}
            {carts.map((items, index) => (
              <div key={index} className={styles.cartItem}>
                <div className={styles.itemLeft}>
                  <input type="checkbox" className={styles.checkbox} />
                  <Link
                    to={"/"}
                    className={clsx(
                      "col col-2 col-md-3 col-sm-4",
                      styles.imageWrapper
                    )}
                  >
                    <img src={items.image} alt="SPEEDCAT OG" />
                  </Link>
                  <Link to={"/"} className={styles.itemInfo}>
                    <p className={styles.itemName}>{items.name}</p>
                    <p className={styles.itemType}>
                      Size: {items.size.replace("size", "")}
                    </p>
                    <p className={styles.itemPrice}>
                      {items.cost.toLocaleString("vi-VN")}
                    </p>
                  </Link>
                </div>

                <div className={styles.itemRight}>
                  <button className={styles.deleteBtn}>🗑</button>
                  <div className={styles.quantityBox}>
                    <button>-</button>
                    <input
                      value={items.quantity}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (val >= 0) {
                          setCarts((prevCarts) =>
                            prevCarts.map((cart, i) =>
                              i === index ? { ...cart, quantity: val } : cart
                            )
                          );
                        }
                      }}
                    ></input>
                    <button>+</button>
                  </div>
                </div>
              </div>
            ))}

            {/* Có thể copy thêm nhiều .cartItem tương tự */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
