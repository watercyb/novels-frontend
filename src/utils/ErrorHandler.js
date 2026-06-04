import i18n from "../locales/i18n";
import showToast from "./Toast";

const errorHandler = (set, error, defaultMessage, isToast) => {
  if (error?.response?.status) {
    if (error.response.status == 429) {
      showToast(i18n.t("too_many_requests", { id: "error" }));
    } else if (error.response.status == 502) {
      showToast(i18n.t("bad_gateway", { id: "error" }));
    } else {
      if (isToast)
        showToast(i18n.t(error.response.data.message), { id: "error" });
      set({ error: i18n.t(error.response.data.message) || defaultMessage });
    }
  } else {
    set({ error: i18n.t(error.message) || defaultMessage });
  }
};

export default errorHandler;
