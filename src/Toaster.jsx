// src/components/ToastNotifier.js
import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Toaster = ({ message, type }) => {
  const notify = () => {
    switch (type) {
      case 'success':
        toast.success(message);
        break;
      case 'error':
        toast.error(message);
        break;
      case 'info':
        toast.info(message);
        break;
      case 'warning':
        toast.warning(message);
        break;
      default:
        toast(message);
    }
  };

  React.useEffect(() => {
    if (message) {
      notify();
    }
  }, [message, type]);

  return <ToastContainer />;
};

export default Toaster;