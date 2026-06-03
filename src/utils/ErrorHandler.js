import toast from "react-hot-toast";
import i18n from "../locales/i18n";

const errorHandler = (set, error, defaultMessage, isToast) => {
  if (error?.response?.status) {
    if (error.response.status == 429) {
      toast.error(i18n.t("too_many_requests"));
    } else {
      if (isToast) toast.error(i18n.t(error.response.data.message));
      set({ error: i18n.t(error.response.data.message) || defaultMessage });
    }
  } else {
    set({ error: i18n.t(error.message) || defaultMessage });
  }
};

export default errorHandler;
