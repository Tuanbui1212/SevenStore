import styles from "./OrderDetail.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";
import noItem from "../../assets/images/no-item.jpg";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import no_img from "../../assets/images/no_img.jpg";

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderDetail, setOrderDetail] = useState([]);
  const [bill, setBill] = useState([]);

  const fetchOrderDetail = () => {
    fetch(`http://localhost:5000/dashboard/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrderDetail(data.order.items);
        console.log(data.order);
        setBill(data.order);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchOrderDetail();
  }, []);

  return (
    <>
      <div className={clsx("container", styles.cartContainer)}>
        <div className={styles.btnBack}>
          <button
            onClick={() => {
              navigate("/dashboard/orders");
            }}
          >
            Back
          </button>
        </div>
        <div className={clsx("row", styles.rowOrder)}>
          {orderDetail.length > 0 ? (
            <div className="col col-8">
              <div className={styles.cartList}>
                {orderDetail.map((items, index) => (
                  <div key={index} className={styles.cartItem}>
                    <div className={styles.itemLeft}>
                      <Link
                        to={`/product/${items.productId.brand}/${items.productId.slug}`}
                        className={clsx(
                          "col col-2 col-md-3 col-sm-4",
                          styles.imageWrapper
                        )}
                      >
                        <img
                          src={items.productId.image.image1 || no_img}
                          alt=""
                        />
                      </Link>
                      <Link
                        to={`/product/${items.productId.brand}/${items.productId.slug}`}
                        className={styles.itemInfo}
                      >
                        <p className={styles.itemName}>
                          {items.productId.name}
                        </p>
                        <p className={styles.itemType}>
                          Size: {items.size.replace("size", "")}
                        </p>

                        <p className={styles.itemQuantity}>
                          Quantity: {items.quantity}
                        </p>
                        <p className={styles.itemPrice}>
                          {items.productId.cost.toLocaleString("vi-VN")} đ
                        </p>
                      </Link>
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

          <div className={clsx("col col-3")}>
            <div className={styles.orderSummary}>
              <h3>Order Summary</h3>

              <div className={styles.orderInfo}>
                <p>
                  <strong>Customer:</strong> {bill.name}
                </p>
                <p>
                  <strong>Phone:</strong> {bill.phone}
                </p>
                <p>
                  <strong>Email:</strong> {bill.email}
                </p>
                <p>
                  <strong>Address:</strong> {bill.address}, {bill.city}
                </p>
                <p>
                  <strong>Payment method:</strong> {bill.paymentMethod}
                </p>
                {bill.note && (
                  <p>
                    <strong>Note:</strong> {bill.note}
                  </p>
                )}
              </div>

              <div className={styles.orderTotal}>
                <p>
                  <strong>Total:</strong>{" "}
                  {bill?.totalPrice?.toLocaleString("vi-VN")} đ
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetail;
