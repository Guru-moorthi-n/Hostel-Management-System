import { createContext, useContext, useState } from "react";
import Toast from "./Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toast, setToast] = useState({
    show: false,
    title: "",
    message: "",
    type: "success",
  });

  function showToast(type, title, message) {
    setToast({
      show: false,
      title: "",
      message: "",
      type,
    });

    setTimeout(() => {
      setToast({
        show: true,
        type,
        title,
        message,
      });
    }, 10);
  }

  function hideToast() {
    setToast((prev) => ({
      ...prev,
      show: false,
    }));
  }

  return (
    <ToastContext.Provider
      value={{
        showToast,
      }}
    >
      {children}

      <Toast
        show={toast.show}
        title={toast.title}
        message={toast.message}
        type={toast.type}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}