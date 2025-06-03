import React from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = ({ message, type, toastKey }) => {
  React.useEffect(() => {
    if (message) {
      switch (type) {
        case "success":
          toast.success(message);
          break;
        case "error":
          toast.error(message);
          break;
        case "info":
          toast.info(message);
          break;

        case "warning":
          toast.warning(message);
          break;
        default:
          toast(message);
      }
    }
  }, [toastKey]); // ✅ Ensure useEffect runs when toastKey changes

  return (
    <ToastContainer
      autoClose={5000}
      hideProgressBar
      closeOnClick
      draggable
      stacked
    />
  );
};

export default Toaster;
