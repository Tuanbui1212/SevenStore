import styles from "./EditProduct.module.scss";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

function Product() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [`size${36 + i}`, 0])
    ),
    image: Object.fromEntries(
      Array.from({ length: 6 }, (_, i) => [`image${i + 1}`, ""])
    ),

    status: "",
    cost: "",
    description: "",
    color: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("size")) {
      setFormData((prev) => ({
        ...prev,
        size: {
          ...prev.size,
          [name]: Number(value),
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
    // fetch(`http://localhost:5000/dashboard/products/${id}`)
    //   .then((res) => res.json())
    axios
      .get(`/dashboard/products/${id}`)
      .then((res) => {
        setFormData(res.data.product);
      })
      .catch((err) => console.error("Lỗi fetch:", err));
  }, [id]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.brand || !formData.cost) {
      setModalMessage("Please fill out all fields!");
      setShowModal(true);
      return;
    }

    // fetch(`http://localhost:5000/dashboard/products/${id}`, {
    //   method: "PUT",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // })
    //   .then((res) => res.json())
    axios
      .put(`/dashboard/products/${id}`, formData)
      .then((data) => {
        setModalMessage("Updated successfully");
        setShowModal(true);
      })
      .catch(() => alert("❌ Update failed"));
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
            <label htmlFor="name">Product Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
            />
          </div>

          <div className={clsx(styles.formGroup, styles.formColor)}>
            <label htmlFor="color">Color</label>
            <input
              id="color"
              name="color"
              type="text"
              value={formData.color}
              onChange={handleChange}
              placeholder="Enter product color"
            />
          </div>

          <div className={clsx(styles.formGroup, styles.formCost)}>
            <label htmlFor="cost">Price</label>
            <input
              id="cost"
              name="cost"
              type="number"
              value={formData.cost}
              onChange={handleChange}
              placeholder="Enter product price"
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
              placeholder="Enter brand name"
            />
          </div>

          <div className={clsx(styles.formGroup, styles.formDescription)}>
            <label htmlFor="description">Description</label>
            <input
              id="description"
              name="description"
              type="text"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
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
              <option value="null">-- Select status --</option>
              <option value="New">New</option>
              <option value="BestSeller">Best Seller</option>
              <option value="Sale">Sale</option>
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
                if (modalMessage.includes("Updated successfully")) {
                  navigate("/dashboard/products");
                }
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Product;
