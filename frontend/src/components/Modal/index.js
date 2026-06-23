import React, { useEffect } from "react";
import styles from "./Modal.module.scss";
import clsx from "clsx";

/**
 * Reusable Modal Component
 * 
 * @param {boolean} isOpen - Indicates whether the modal is open
 * @param {string} title - The title of the modal
 * @param {string} message - The message inside the modal
 * @param {string} type - Modal type: 'success', 'error', 'info', 'warning'
 * @param {Function} onClose - Function to call when the modal is closed
 * @param {string} confirmText - Text for the confirm button
 */
function Modal({ isOpen, title, message, type = "info", onClose, confirmText = "Close" }) {
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

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={clsx(styles.icon, styles[type])}>
          <i className={iconClass}></i>
        </div>
        {title && <h3 className={styles.title}>{title}</h3>}
        <p className={styles.message}>{message}</p>
        <div className={styles.buttonContainer}>
          <button className={clsx(styles.button, styles.primary)} onClick={onClose}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Modal;
