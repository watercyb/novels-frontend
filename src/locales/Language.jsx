import { useTranslation } from "react-i18next";

const Language = () => {
  const { t, i18n } = useTranslation();

  const switchLanguage = () => {
    if (i18n.language == "en") {
      i18n.changeLanguage("zh");
    } else {
      i18n.changeLanguage("en");
    }
  };
  return (
    <button className="btn" onClick={switchLanguage}>
      {t("language_switcher")}
    </button>
  );
};

export default Language;
