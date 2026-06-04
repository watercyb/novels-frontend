import toast from "react-hot-toast";

const showToast = (message, type) => {
  toast.dismiss();

  if (type === "success") {
    toast.success(message);
  } else {
    toast.error(message);
  }
};

export default showToast;
