import { useEffect, useState } from "react";
import { t } from "i18next";
import useNovelStore from "../novels/UseNovelStore";
import i18n from "../locales/i18n";
import showToast from "../utils/Toast";
import useMyNovelStore from "./UseMyNovelStore";

const UpdateTagDialog = ({ updateTagDialogOpen, setUpdateTagDialogOpen }) => {
  const { tags, isLoadingTags, getTags } = useNovelStore();
  const { novel, isUpdatingTags, updateTags } = useMyNovelStore();
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    if (updateTagDialogOpen && !tags && !isLoadingTags) getTags();
  }, [updateTagDialogOpen, getTags, isLoadingTags, tags]);

  useEffect(() => {
    if (novel.tags) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedTags(novel.tags.map((tag) => tag.id));
    }
  }, [novel.tags]);

  return (
    <dialog open={updateTagDialogOpen} className="modal">
      <div>
        {/* Loading */}
        {(!tags || isLoadingTags) && (
          <div className="flex justify-center py-20">
            <span className="loading loading-spinner loading-lg mr-4"></span>
            {t("loading")}
          </div>
        )}
        {tags && (
          <div className="modal-box w-11/12 max-w-3xl">
            <h3 className="font-bold text-xl mb-6">{t("update_tags")}</h3>

            <div className="space-y-5">
              {/* Tags */}
              <div>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <label
                      key={tag.id}
                      className="cursor-pointer flex items-center gap-2 border rounded-full px-3 py-1"
                    >
                      <input
                        type="checkbox"
                        className="checkbox checkbox-sm"
                        checked={selectedTags.includes(tag.id)}
                        onChange={() => {
                          if (selectedTags.includes(tag.id)) {
                            setSelectedTags([
                              ...selectedTags.filter((id) => id != tag.id),
                            ]);
                          } else {
                            setSelectedTags([...selectedTags, tag.id]);
                          }
                        }}
                      />
                      <span>
                        {i18n.language == "en" ? tag.name : tag.nameCN}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => {
                  setUpdateTagDialogOpen(false);
                  setSelectedTags((novel.tags ?? []).map((tag) => tag.id));
                }}
                disabled={isUpdatingTags}
              >
                {t("cancel")}
              </button>

              <button
                className="btn btn-primary"
                onClick={async () => {
                  if (await updateTags(novel.id, selectedTags)) {
                    showToast(t("tag_updated"), "success");
                    setUpdateTagDialogOpen(false);
                  }
                }}
                disabled={isUpdatingTags}
              >
                {isUpdatingTags ? (
                  <div className="min-w-10">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : (
                  t("update")
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default UpdateTagDialog;
