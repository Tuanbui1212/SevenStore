import React, { createContext, useContext, useState, useCallback } from "react";
import Modal from "../components/Modal";

const ModalContext = createContext();

export const useModal = () => {
  return useContext(ModalContext);
};

export const ModalProvider = ({ children }) => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "info", // 'success', 'error', 'info', 'warning'
    confirmText: "Đóng",
    cancelText: "Hủy",
    showCancelButton: false,
    onConfirm: null,
    onCancel: null,
  });

  const hideModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const showModal = useCallback(({ title, message, type = "info", confirmText = "Đóng", onConfirm }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      showCancelButton: false,
      onConfirm,
      onCancel: null,
    });
  }, []);

  const confirmModal = useCallback(({ title = "Xác nhận", message, type = "warning", confirmText = "Xác nhận", cancelText = "Hủy", onConfirm, onCancel }) => {
    setModalState({
      isOpen: true,
      title,
      message,
      type,
      confirmText,
      cancelText,
      showCancelButton: true,
      onConfirm,
      onCancel,
    });
  }, []);

  return (
    <ModalContext.Provider value={{ showModal, confirmModal, hideModal }}>
      {children}
      <Modal
        {...modalState}
        onClose={hideModal}
      />
    </ModalContext.Provider>
  );
};
