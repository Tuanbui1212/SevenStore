import React, { useEffect } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";

/**
 * Reusable Global Modal Component
 */
function Modal({ 
  isOpen, 
  title, 
  message, 
  type = "info", 
  onClose, 
  confirmText = "Đóng",
  cancelText = "Hủy",
  showCancelButton = false,
  onConfirm,
  onCancel
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  let iconClass = "fa-solid fa-circle-info";
  if (type === "success") iconClass = "fa-solid fa-check-circle";
  if (type === "error") iconClass = "fa-solid fa-circle-xmark";
  if (type === "warning") iconClass = "fa-solid fa-triangle-exclamation";

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    onClose();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={clsx(styles.icon, styles[type])}>
          <i className={iconClass}></i>
        </div>
        {title && <h3 className={styles.title}>{title}</h3>}
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          {showCancelButton && (
            <button className={clsx(styles.button, styles.cancel)} onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button 
            className={clsx(styles.button, styles.confirm, styles[`btn_${type}`])} 
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
