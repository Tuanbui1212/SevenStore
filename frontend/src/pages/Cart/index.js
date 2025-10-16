import styles from "./Cart.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";
import noItem from "../../assets/images/no-item.jpg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Cart() {
  const [carts, setCarts] = useState([]);
  const [size, setSize] = useState([]);
  const [deleteId, setDeleteId] = useState([]);

  const [checkedItems, setCheckedItems] = useState([]); // lưu id đã tick
  const items = [1, 2, 3]; // ví dụ có 3 sản phẩm
  const [checkAll, setCheckAll] = useState(false); // check all

  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchCart = () => {
    const user = localStorage.getItem("user");

    if (!user) return;
    let url = `http://localhost:5000/cart?`;

    if (user) url += `user=${encodeURIComponent(user)}`;

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCarts(data.cart || []);
        console.log(data.cart);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleChane = (data) => {
    const user = localStorage.getItem("user");
    if (!user) return;
    let url = `http://localhost:5000/cart?`;
    if (user) url += `user=${encodeURIComponent(user)}`;
    fetch(url, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
  };

  const handleDelete = () => {
    const user = localStorage.getItem("user");

    if (!deleteId) return;
    if (!user) return;

    let url = `http://localhost:5000/cart?`;
    if (user) url += `user=${encodeURIComponent(user)}&`;
    if (deleteId) url += `deleteId=${encodeURIComponent(deleteId)}&`;
    if (size) url += `size=${encodeURIComponent(size)}&`;

    fetch(url, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then(() => {
        setModalMessage("✅ Successfully deleted!");
        setShowModal(true);
        fetchCart();
      })
      .catch(() => {
        setModalMessage("❌ Failed to delete!");
        setShowModal(true);
      });
  };

  const handleCheckAll = (e) => {
    const checked = e.target.checked;
    setCheckAll(checked);

    // Nếu tick => chọn hết, nếu bỏ => bỏ hết
    setCheckedItems(checked ? items : []);
  };

  const handleCheck = (id) => {
    if (checkedItems.includes(id)) {
      // Bỏ tick
      const newList = checkedItems.filter((item) => item !== id);
      setCheckedItems(newList);
      setCheckAll(false);
    } else {
      // Tick thêm
      const newList = [...checkedItems, id];
      setCheckedItems(newList);
      if (newList.length === items.length) setCheckAll(true);
    }
  };

  return (
    <div className={clsx("container", styles.cartContainer)}>
      <div className="row">
        {carts.length > 0 ? (
          <div className="col col-9">
            <div className={styles.selectAll}>
              <input
                type="checkbox"
                checked={checkAll}
                onChange={handleCheckAll}
              />
              <span>All</span>
            </div>

            {/* List of products */}
            <div className={styles.cartList}>
              {/* Item */}
              {carts.map((items, index) => (
                <div key={index} className={styles.cartItem}>
                  <div className={styles.itemLeft}>
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(items.id)}
                      onChange={() => handleCheck(items.id)}
                      className={styles.checkbox}
                    />
                    <Link
                      to={`/product/${items.brand}/${items.slug}`}
                      className={clsx(
                        "col col-2 col-md-3 col-sm-4",
                        styles.imageWrapper
                      )}
                    >
                      <img src={items.image} alt="SPEEDCAT OG" />
                    </Link>
                    <Link
                      to={`/product/${items.brand}/${items.slug}`}
                      className={styles.itemInfo}
                    >
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
                    <div className={styles.quantityBox}>
                      <button
                        disabled={items.quantity < 1}
                        onClick={() => {
                          const val = items.quantity - 1;
                          if (val >= 0) {
                            setCarts((prevCarts) =>
                              prevCarts.map((cart, i) =>
                                i === index ? { ...cart, quantity: val } : cart
                              )
                            );
                          }

                          handleChane({
                            id: items.id,
                            size: items.size,
                            quantity: val,
                            cost: items.cost,
                          });
                        }}
                      >
                        -
                      </button>
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

                          handleChane({
                            id: items.id,
                            size: items.size,
                            quantity: val,
                            cost: items.cost,
                          });
                        }}
                      ></input>
                      <button
                        disabled={items.quantity < 1}
                        onClick={() => {
                          const val = items.quantity + 1;
                          if (val >= 0) {
                            setCarts((prevCarts) =>
                              prevCarts.map((cart, i) =>
                                i === index ? { ...cart, quantity: val } : cart
                              )
                            );
                          }

                          handleChane({
                            id: items.id,
                            size: items.size,
                            quantity: val,
                            cost: items.cost,
                          });
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        setDeleteId(items.id);
                        setSize(items.size);
                        setModalMessage(
                          "Are you sure you want to delete this item?"
                        );
                        setShowModal(true);
                      }}
                      className={styles.deleteBtn}
                    >
                      <i className="fa-solid fa-trash"></i>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={clsx("col col-12", styles.image__no__item)}>
            <h1>No products added yet</h1>
            <img src={noItem} alt="No items in cart" />
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            {!modalMessage.includes("Successfully") && (
              <>
                <button
                  className={clsx(styles.success)}
                  onClick={() => handleDelete()}
                >
                  Yes
                </button>
                <button
                  className={clsx(styles.danger)}
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  No
                </button>
              </>
            )}

            {modalMessage.includes("Successfully") && (
              <>
                <button
                  onClick={() => {
                    setShowModal(false);
                  }}
                  className={clsx(styles.success)}
                >
                  Oke
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
