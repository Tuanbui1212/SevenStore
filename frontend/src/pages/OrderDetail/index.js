import styles from "./OrderDetail.module.scss";
import "../../components/GlobalStyles/GlobalStyles.scss";
import noItem from "../../assets/images/no-item.jpg";
import clsx from "clsx";
import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "../../util/axios";
import { useModal } from "../../contexts/ModalContext";
import no_img from "../../assets/images/no_img.jpg";

const STATUS_CLASS = {
  Pending: "statusPending",
  Confirmed: "statusConfirmed",
  Shipping: "statusShipping",
  Delivered: "statusDelivered",
  Cancelled: "statusCancelled",
};

function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showModal } = useModal();

  const [orderDetail, setOrderDetail] = useState([]);
  const [bill, setBill] = useState({});
  const [updating, setUpdating] = useState(false);

  const fetchOrderDetail = useCallback(() => {
    axios
      .get(`/dashboard/orders/${id}`)
      .then((res) => {
        setOrderDetail(res.data.order?.items || []);
        setBill(res.data.order || {});
      })
      .catch((err) => console.error(err));
  }, [id]);

  useEffect(() => {
    fetchOrderDetail();
  }, [fetchOrderDetail]);

  const handleUpdateStatus = (newStatus) => {
    setUpdating(true);
    axios
      .put(`/dashboard/orders/${id}`, { status: newStatus })
      .then(() => {
        setBill((prev) => ({ ...prev, status: newStatus }));
        showModal({
          title: "Success",
          message: `Order status updated to ${newStatus}`,
          type: "success",
        });
      })
      .catch((err) => console.error(err))
      .finally(() => setUpdating(false));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "--";
    return new Date(dateString).toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const currentStatus = bill.status || "Pending";

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topBar}>
        <button
          type="button"
          className={styles.btnBack}
          onClick={() => navigate(-1)}
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Back to Orders</span>
        </button>

        {bill._id && (
          <div className={styles.orderTitleBox}>
            <span className={styles.orderCode}>
              Order #{bill._id.slice(-6).toUpperCase()}
            </span>
            <span
              className={clsx(
                styles.statusBadge,
                styles[STATUS_CLASS[currentStatus]]
              )}
            >
              <span className={styles.statusDot} />
              {currentStatus}
            </span>
          </div>
        )}
      </div>

      <div className={clsx("row", styles.rowOrder)}>
        {orderDetail.length > 0 ? (
          <div className="col col-8 col-md-12 col-sm-12">
            <div className={styles.cardBox}>
              <h3 className={styles.sectionTitle}>
                Ordered Items ({orderDetail.length})
              </h3>
              <div className={styles.cartList}>
                {orderDetail.map((items, index) => (
                  <div key={index} className={styles.cartItem}>
                    <Link
                      to={
                        items.productId
                          ? `/product/${items.productId?.brand || "all"}/${
                              items.productId?.slug || ""
                            }`
                          : "#"
                      }
                      className={styles.imageWrapper}
                    >
                      <img
                        src={items.productId?.image?.image1 || no_img}
                        alt={items.productId?.name || "Product"}
                      />
                    </Link>
                    <div className={styles.itemInfo}>
                      <Link
                        to={
                          items.productId
                            ? `/product/${items.productId?.brand || "all"}/${
                                items.productId?.slug || ""
                              }`
                            : "#"
                        }
                        className={styles.itemName}
                      >
                        {items.productId?.name || "Deleted Product"}
                      </Link>
                      <div className={styles.itemMeta}>
                        <span>
                          Size:{" "}
                          <strong>
                            {items.size ? items.size.replace("size", "") : "-"}
                          </strong>
                        </span>
                        <span>•</span>
                        <span>
                          Qty: <strong>{items.quantity}</strong>
                        </span>
                      </div>
                      <p className={styles.itemPrice}>
                        {(
                          items.price ||
                          items.productId?.cost ||
                          0
                        ).toLocaleString("vi-VN")}{" "}
                        ₫
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className={clsx("col col-8 col-md-12 col-sm-12", styles.image__no__item)}>
            <h1>No products in this order</h1>
            <img src={noItem} alt="No items" />
          </div>
        )}

        <div className="col col-4 col-md-12 col-sm-12">
          <div className={styles.orderSummary}>
            <h3 className={styles.sectionTitle}>Order Summary</h3>

            <div className={styles.orderInfo}>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Date</span>
                <span className={styles.infoVal}>{formatDate(bill.createdAt)}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Customer</span>
                <span className={styles.infoVal}>{bill.name || "--"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Phone</span>
                <span className={styles.infoVal}>{bill.phone || "--"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Email</span>
                <span className={styles.infoVal}>{bill.email || "--"}</span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Address</span>
                <span className={styles.infoVal}>
                  {[bill.address, bill.city].filter(Boolean).join(", ") || "--"}
                </span>
              </div>
              <div className={styles.infoRow}>
                <span className={styles.infoLabel}>Payment</span>
                <span className={styles.infoVal}>{bill.paymentMethod || "--"}</span>
              </div>
              {bill.note && (
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>Note</span>
                  <span className={styles.infoVal}>{bill.note}</span>
                </div>
              )}
            </div>

            <div className={styles.orderTotal}>
              <span>Total Amount</span>
              <strong>{bill?.totalPrice?.toLocaleString("vi-VN") || 0} ₫</strong>
            </div>

            {/* Quick Status Update Controls */}
            <div className={styles.statusActions}>
              <span className={styles.actionHeading}>Update Order Status</span>
              <div className={styles.statusBtnGrid}>
                {["Pending", "Confirmed", "Shipping", "Delivered", "Cancelled"].map(
                  (st) => (
                    <button
                      key={st}
                      type="button"
                      disabled={updating || currentStatus === st}
                      className={clsx(
                        styles.statusActionBtn,
                        styles[STATUS_CLASS[st]],
                        currentStatus === st && styles.currentStatusBtn
                      )}
                      onClick={() => handleUpdateStatus(st)}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderDetail;
