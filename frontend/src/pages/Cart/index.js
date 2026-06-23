import styles from "./Cart.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";
import noItem from "../../assets/images/no-item.jpg";
import clsx from "clsx";
import { useEffect, useState, useCallback, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../util/axios";
import { useAuth } from "../../contexts/AuthContext";

import no_img from "../../assets/images/no_img.jpg";

function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [carts, setCarts] = useState([]);
  const [size, setSize] = useState([]);
  const [deleteId, setDeleteId] = useState([]);

  const [checkedItems, setCheckedItems] = useState([]);

  const { showModal, confirmModal } = useModal();

  const fetchCart = useCallback(() => {
    if (!user) return;
    axios
      .get(`/cart?user=${encodeURIComponent(user)}`)
      .then((res) => {
        setCarts(res.data.cart);
      })
      .catch((err) => console.error(err));
  }, [user]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleChane = useCallback((data) => {
    if (!user) return;
    axios.put(`/cart?user=${encodeURIComponent(user)}`, data);
  }, [user]);

  const handleDelete = useCallback(() => {
    if (!deleteId) return;
    if (!user) return;

    let url = `/cart?user=${encodeURIComponent(user)}&`;
    if (deleteId) url += `deleteId=${encodeURIComponent(deleteId)}&`;
    if (size) url += `size=${encodeURIComponent(size)}&`;

    axios
      .delete(url)
      .then(() => {
        showModal({
          title: "Success",
          message: "Successfully deleted!",
          type: "success"
        });
        fetchCart();
      })
      .catch(() => {
        showModal({
          title: "Error",
          message: "Failed to delete!",
          type: "error"
        });
      });
  }, [deleteId, size, user, fetchCart]);

  const handleCheckItems = useCallback((
    idItem,
    sizeItem,
    costItem,
    quantityItem,
    imageItem,
    nameItem
  ) => {
    setCheckedItems((prev) => {
      const exists = prev.some(
        (item) => item.id === idItem && item.size === sizeItem
      );

      if (exists) {
        return prev.filter(
          (item) => !(item.id === idItem && item.size === sizeItem)
        );
      } else {
        return [
          ...prev,
          {
            id: idItem,
            size: sizeItem,
            cost: costItem,
            quantity: quantityItem,
            image: imageItem,
            name: nameItem,
          },
        ];
      }
    });
  }, []);

  const totalCost = useMemo(
    () => checkedItems.reduce((sum, item) => sum + item.cost * item.quantity, 0),
    [checkedItems]
  );

  const handleGoToPayment = useCallback(() => {
    if (checkedItems.length >= 1) {
      navigate("/payment", {
        state: {
          checkedItems,
          totalCost,
        },
      });
    } else {
      showModal({
        title: "Warning",
        message: "Please select the product you want to buy.",
        type: "warning"
      });
    }
  }, [checkedItems, totalCost, navigate]);

  return (
    <>
      <div className={clsx("container", styles.cartContainer)}>
        <div className="row">
          {carts.length > 0 ? (
            <div className="col col-9">
              <div className={styles.selectAll}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    if (e.target.checked) {
                      setCheckedItems(
                        carts.map((item) => ({
                          id: item.id,
                          size: item.size,
                          cost: item.cost,
                          quantity: item.quantity,
                          image: item.image,
                          name: item.name,
                        }))
                      );
                    } else {
                      setCheckedItems([]);
                    }
                  }}
                  checked={checkedItems.length === carts.length}
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
                        className={styles.checkbox}
                        checked={checkedItems.some(
                          (item) =>
                            item.id === items.id && item.size === items.size
                        )}
                        onChange={() => {
                          handleCheckItems(
                            items.id,
                            items.size,
                            items.cost,
                            items.quantity,
                            items.image,
                            items.name
                          );
                        }}
                      />
                      <Link
                        to={`/product/${items.brand}/${items.slug}`}
                        className={clsx(
                          "col col-2 col-md-3 col-sm-4",
                          styles.imageWrapper
                        )}
                      >
                        <img src={items.image || no_img} alt="SPEEDCAT OG" />
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
                                  i === index
                                    ? { ...cart, quantity: val }
                                    : cart
                                )
                              );
                            }
                            setCheckedItems([]);
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
                            setCheckedItems([]);
                            const val = Number(e.target.value);
                            if (val >= 0) {
                              setCarts((prevCarts) =>
                                prevCarts.map((cart, i) =>
                                  i === index
                                    ? { ...cart, quantity: val }
                                    : cart
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
                            setCheckedItems([]);
                            const val = items.quantity + 1;
                            if (val >= 0) {
                              setCarts((prevCarts) =>
                                prevCarts.map((cart, i) =>
                                  i === index
                                    ? { ...cart, quantity: val }
                                    : cart
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
                          confirmModal({
                            title: "Confirm Deletion",
                            message: "Are you sure you want to delete this item?",
                            type: "warning",
                            confirmText: "Yes, delete",
                            onConfirm: () => {
                              let url = `/cart?user=${encodeURIComponent(user)}&deleteId=${encodeURIComponent(items.id)}&size=${encodeURIComponent(items.size)}&`;
                              axios.delete(url)
                                .then(() => {
                                  showModal({ title: "Success", message: "Successfully deleted!", type: "success" });
                                  fetchCart();
                                })
                                .catch(() => {
                                  showModal({ title: "Error", message: "Failed to delete!", type: "error" });
                                });
                            }
                          });
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

      </div>

      <div className={clsx(styles.cartFooter)}>
        <div className={clsx("container", styles.cartFooter__container)}>
          <div className={clsx("row", styles.cartFooter__row)}>
            <div className={clsx("col col-3", styles.cartFooter__left)}>
              <span>Your Cart ({checkedItems.length} product)</span>
              <span>{totalCost.toLocaleString("vi-VN")}₫</span>
            </div>
            <div className={clsx("col col-2", styles.cartFooter__right)}>
              <button onClick={() => handleGoToPayment()}>PAY</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
