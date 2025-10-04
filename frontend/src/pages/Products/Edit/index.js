import styles from "./CreatProduct.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [`size${36 + i}`, ""])
    ),
    image: Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [`image${i + 1}`, ""])
    ),

    status: "",
    cost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("size")) {
      setFormData((prev) => ({
        ...prev,
        size: {
          ...prev.size,
          [name]: value,
        },
      }));
    } else if (name.startsWith("image")) {
      setFormData((prev) => ({
        ...prev,
        image: {
          ...prev.image,
          [name]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5000/dashboard/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFormData(data.product);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.cost) {
      setModalMessage("Vui lòng nhập đầy đủ thông tin!");
      setShowModal(true);
      return;
    }

    fetch(`http://localhost:5000/dashboard/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalMessage("Sửa thành công");
        setShowModal(true);
      })
      .catch(() => alert("❌ Có lỗi xảy ra khi thêm nhân viên"));
  };

  return (
    <>
      <Link to="/dashboard/products" className={styles.btnBack}>
        Back
      </Link>

      <form className={styles.productForm} onSubmit={handleSubmit}>
        <h1> EDIT PRODUCT</h1>

        <div className={styles.nameAndCost}>
          <div className={clsx(styles.formGroup, styles.formName)}>
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập tên sản phẩm"
            />
          </div>

          <div className={clsx(styles.formGroup, styles.formCost)}>
            <label htmlFor="cost">Cost</label>
            <input
              id="cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Nhập giá sản phẩm"
            />
          </div>
        </div>

        <div className={styles.brandAndStatus}>
          <div className={clsx(styles.formGroup, styles.formBrand)}>
            <label htmlFor="brand">Brand</label>
            <input
              id="brand"
              name="brand"
              type="text"
              value={formData.brand}
              onChange={handleChange}
              placeholder="Nhập thương hiệu"
            />
          </div>
          <div className={clsx(styles.formGroup, styles.formStatus)}>
            <label htmlFor="status">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="">-- Trạng thái --</option>
              <option value="New">New</option>
              <option value="Hot">Hot</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="image1">Image</label>
          <div className={styles.formImg}>
            {Array.from({ length: 6 }, (_, i) => 1 + i).map((img) => (
              <input
                key={img}
                id={`image${img}`}
                name={`image${img}`}
                placeholder={`image${img}`}
                type="url"
                value={formData.image[`image${img}`] ?? ""}
                onChange={handleChange}
              />
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="size1">Size</label>
          <div className={styles.formSize}>
            {Array.from({ length: 10 }, (_, i) => 36 + i).map((size) => (
              <input
                key={size}
                id={`size${size}`}
                type="number"
                name={`size${size}`}
                value={formData.size[`size${size}`]}
                onChange={handleChange}
                placeholder={`Size ${size}`}
              />
            ))}
          </div>
        </div>

        <button
          type="submit"
          className={clsx(
            styles.submitBtn,
            (!formData.name || !formData.brand || !formData.cost) &&
              styles.disabled
          )}
          disabled={!formData.name || !formData.brand || !formData.cost}
        >
          UPDATE
        </button>
      </form>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
                if (modalMessage.includes("thành công")) {
                  navigate("/dashboard/products");
                }
              }}
            >
              Đóng
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
