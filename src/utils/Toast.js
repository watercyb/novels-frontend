import toast from "react-hot-toast";
import i18n from "../locales/i18n";

export const tooManyRequests = () => {
  toast.error(i18n.t("too_many_requests"));
};
