import styles from "./CreateProduct.module.scss";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Link } from "react-router-dom";
import axios from "../../../util/axios";

const BRAND_SUGGESTIONS = [
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
];

// Lấy Key từ biến môi trường
const IMGBB_API_KEY = process.env.REACT_APP_IMGBB_API_KEY;

function CreateProduct() {
  const navigate = useNavigate();
  const [modalMessage, setModalMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [errors, setErrors] = useState({});
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredBrands, setFilteredBrands] = useState(BRAND_SUGGESTIONS);
  const wrapperRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    size: Object.fromEntries(
      Array.from({ length: 10 }, (_, i) => [`size${36 + i}`, ""])
    ),
    status: "null",
    cost: "",
    description: "",
    color: "",
  });

  // Log kiểm tra Key khi component load
  useEffect(() => {
    console.log("Current ImgBB Key:", IMGBB_API_KEY);
    if (!IMGBB_API_KEY) {
      alert(
        "Chưa cấu hình API Key! Hãy kiểm tra file .env và khởi động lại Server."
      );
    }
  }, []);

  // Đóng gợi ý khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef]);

  // --- SỬA LỖI BLOB: Chỉ revoke khi component unmount hẳn ---
  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Truyền mảng rỗng để chỉ chạy khi thoát trang

  const handleBrandChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, brand: value }));
    if (errors.brand) setErrors((prev) => ({ ...prev, brand: "" }));
    const filtered = BRAND_SUGGESTIONS.filter((brand) =>
      brand.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBrands(filtered);
    setShowSuggestions(true);
  };

  const handleSelectBrand = (brand) => {
    setFormData((prev) => ({ ...prev, brand: brand }));
    setErrors((prev) => ({ ...prev, brand: "" }));
    setShowSuggestions(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
    if (name.startsWith("size")) {
      setFormData((prev) => ({
        ...prev,
        size: { ...prev.size, [name]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + selectedFiles.length > 6) {
      alert("You can only upload a maximum of 6 images.");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles((prev) => [...prev, ...files]);
    setPreviewUrls((prev) => [...prev, ...newPreviews]);
    if (errors.images) setErrors((prev) => ({ ...prev, images: "" }));

    // Reset input value để cho phép chọn lại cùng 1 file nếu lỡ xóa
    e.target.value = null;
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    // Revoke URL của ảnh bị xóa để giải phóng bộ nhớ
    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const uploadToImgBB = async (file) => {
    const form = new FormData();
    form.append("image", file);
    try {
      // Log để debug nếu lỗi 400
      console.log("Uploading with key:", IMGBB_API_KEY);

      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        { method: "POST", body: form }
      );
      const data = await res.json();
      if (!data.success) {
        console.error("ImgBB Error:", data.error);
        return null;
      }
      return data.data.url;
    } catch (err) {
      console.error("Upload fetch error:", err);
      return null;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;
    if (!formData.name.trim()) {
      newErrors.name = "Please enter product name";
      isValid = false;
    }
    const isBrandValid = BRAND_SUGGESTIONS.some(
      (b) => b.toLowerCase() === formData.brand.trim().toLowerCase()
    );
    if (!formData.brand.trim()) {
      newErrors.brand = "Please select a brand";
      isValid = false;
    } else if (!isBrandValid) {
      newErrors.brand = "Invalid brand! Select from list.";
      isValid = false;
    }
    if (!formData.cost || Number(formData.cost) <= 0) {
      newErrors.cost = "Invalid price";
      isValid = false;
    }
    if (!formData.color.trim()) {
      newErrors.color = "Please enter color";
      isValid = false;
    }
    if (selectedFiles.length === 0) {
      newErrors.images = "Please upload at least 1 image";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setIsUploading(true);

    try {
      const uploadedURLs = [];
      for (const file of selectedFiles) {
        const url = await uploadToImgBB(file);
        if (url) uploadedURLs.push(url);
      }

      // Nếu số ảnh upload lên không bằng số ảnh đã chọn -> Lỗi
      if (uploadedURLs.length !== selectedFiles.length) {
        throw new Error(
          "Some images failed to upload. Check API Key or Image format."
        );
      }

      setIsUploading(false);

      const imageObject = {};
      for (let i = 0; i < 6; i++) {
        imageObject[`image${i + 1}`] = uploadedURLs[i] || "";
      }

      const normalizedSize = Object.fromEntries(
        Object.entries(formData.size).map(([k, v]) => [
          k,
          v === "" ? 0 : Number(v),
        ])
      );

      const finalData = {
        ...formData,
        image: imageObject,
        size: normalizedSize,
        cost: Number(formData.cost) || 0,
      };

      await axios.post("/dashboard/products/create", finalData);
      setModalMessage("Product created successfully!");
      setIsSuccess(true);
      setShowModal(true);
    } catch (error) {
      console.error(error);
      setModalMessage("❌ Error: " + (error.message || "Something went wrong"));
      setIsSuccess(false);
      setShowModal(true);
    } finally {
      setIsLoading(false);
      setIsUploading(false);
    }
  };

  return (
    <div className={styles.container}>
      <Link to="/dashboard/products" className={styles.btnBack}>
        <i className="fa-solid fa-arrow-left"></i> Back to Products
      </Link>

      <div className={styles.formCard}>
        <h2 className={styles.formTitle}>ADD NEW PRODUCT</h2>

        <form className={styles.productForm} onSubmit={handleSubmit}>
          <div className={styles.nameAndCost}>
            <div className={clsx(styles.formGroup, styles.formName)}>
              <label>Product Name</label>
              <input
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                className={clsx(errors.name && styles.inputError)}
              />
              {errors.name && (
                <span className={styles.errorMsg}>{errors.name}</span>
              )}
            </div>

            <div className={clsx(styles.formGroup, styles.formColor)}>
              <label>Color</label>
              <input
                name="color"
                type="text"
                value={formData.color}
                onChange={handleChange}
                placeholder="Ex: Red, Blue..."
                className={clsx(errors.color && styles.inputError)}
              />
              {errors.color && (
                <span className={styles.errorMsg}>{errors.color}</span>
              )}
            </div>

            <div className={clsx(styles.formGroup, styles.formCost)}>
              <label>Price (VND)</label>
              <input
                name="cost"
                type="number"
                value={formData.cost}
                onChange={handleChange}
                placeholder="Enter price"
                className={clsx(errors.cost && styles.inputError)}
              />
              {errors.cost && (
                <span className={styles.errorMsg}>{errors.cost}</span>
              )}
            </div>
          </div>

          <div className={styles.brandAndStatus}>
            <div
              className={clsx(styles.formGroup, styles.formBrand)}
              ref={wrapperRef}
            >
              <label>Brand</label>
              <div className={styles.inputWithIcon}>
                <input
                  name="brand"
                  type="text"
                  value={formData.brand}
                  onChange={handleBrandChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder="Select a brand..."
                  autoComplete="off"
                  className={clsx(errors.brand && styles.inputError)}
                />
                <i className="fa-solid fa-chevron-down"></i>

                {showSuggestions && (
                  <ul className={styles.suggestionsList}>
                    {filteredBrands.length > 0 ? (
                      filteredBrands.map((brand, index) => (
                        <li
                          key={index}
                          onClick={() => handleSelectBrand(brand)}
                          className={styles.suggestionItem}
                        >
                          {brand}
                        </li>
                      ))
                    ) : (
                      <li className={styles.noSuggestion}>No brand found</li>
                    )}
                  </ul>
                )}
              </div>
              {errors.brand && (
                <span className={styles.errorMsg}>{errors.brand}</span>
              )}
            </div>

            <div className={clsx(styles.formGroup, styles.formDescription)}>
              <label>Description</label>
              <input
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description..."
              />
            </div>

            <div className={clsx(styles.formGroup, styles.formStatus)}>
              <label>Status</label>
              <div className={styles.selectWrapper}>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="null">-- Select --</option>
                  <option value="New">New</option>
                  <option value="BestSeller">Best Seller</option>
                  <option value="Sale">Sale</option>
                </select>
                <i className="fa-solid fa-chevron-down"></i>
              </div>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>
              Product Images ({selectedFiles.length}/6)
              {errors.images && (
                <span className={styles.errorMsgInline}>{errors.images}</span>
              )}
            </label>

            <div className={styles.imageUploadContainer}>
              {previewUrls.map((url, index) => (
                <div key={index} className={styles.imagePreview}>
                  <img src={url} alt={`preview-${index}`} />
                  <button type="button" onClick={() => removeImage(index)}>
                    <i className="fa-solid fa-xmark"></i>
                  </button>
                  <span className={styles.imageIndex}>{index + 1}</span>
                </div>
              ))}

              {selectedFiles.length < 6 && (
                <label className={styles.uploadBox}>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileSelect}
                    hidden
                  />
                  <div className={styles.uploadPlaceholder}>
                    <i className="fa-solid fa-cloud-arrow-up"></i>
                    <span>Add Image</span>
                  </div>
                </label>
              )}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Size Quantity</label>
            <div className={styles.formSize}>
              {Array.from({ length: 10 }, (_, i) => 36 + i).map((size) => (
                <div key={size} className={styles.sizeInputWrapper}>
                  <span>{size}</span>
                  <input
                    type="number"
                    name={`size${size}`}
                    value={formData.size[`size${size}`]}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className={clsx(styles.submitBtn, isLoading && styles.disabled)}
            disabled={isLoading}
          >
            {isUploading ? (
              <>
                {" "}
                <i className="fa-solid fa-cloud-arrow-up fa-bounce"></i>{" "}
                Uploading Images...{" "}
              </>
            ) : isLoading ? (
              <>
                {" "}
                <i className="fa-solid fa-spinner fa-spin"></i> Processing...{" "}
              </>
            ) : (
              "ADD PRODUCT"
            )}
          </button>
        </form>
      </div>

      {showModal && (
        <div className={styles.overlay}>
          <div className={styles.modal}>
            <div
              className={clsx(
                styles.modalIcon,
                isSuccess ? styles.success : styles.error
              )}
            >
              <i
                className={
                  isSuccess
                    ? "fa-solid fa-check-circle"
                    : "fa-solid fa-circle-xmark"
                }
              ></i>
            </div>
            <h3>{isSuccess ? "Success!" : "Error"}</h3>
            <p>{modalMessage}</p>
            <button
              onClick={() => {
                setShowModal(false);
                if (isSuccess) {
                  navigate("/dashboard/products");
                }
              }}
            >
              {isSuccess ? "Go to List" : "Close"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CreateProduct;
