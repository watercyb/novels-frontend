import i18n from "../locales/i18n";

export const formatDate = (date) => {
  if (i18n.language == "en") {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } else {
    return date.toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export const formatDateString = (date) => {
  if (i18n.language == "en") {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } else {
    return new Date(date).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }
};

export const formatDateTimeString = (date) => {
  if (i18n.language == "en") {
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  } else {
    return new Date(date).toLocaleDateString("zh-CN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    });
  }
};
