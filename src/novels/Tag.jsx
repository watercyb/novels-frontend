import { useState } from "react";
import i18n from "../locales/i18n";

const Tag = ({ tagSet, tag, selectTag }) => {
  const [isSelected, setIsSelected] = useState(tagSet.has(tag.id));

  return (
    <button
      key={tag.id}
      onClick={() => {
        selectTag(tag.id, !isSelected);
        setIsSelected(!isSelected);
      }}
      className={`btn btn-sm px-2 py-0.5 min-h-0 h-auto ${isSelected ? "btn-primary" : "btn-outline"}`}
    >
      {i18n.language == "en" ? tag.name : tag.nameCN}
    </button>
  );
};

export default Tag;
