import { useEffect, useRef, useState } from "react";
import { t } from "i18next";
import useNovelStore from "../novels/UseNovelStore";
import i18n from "../locales/i18n";
import { SquarePen } from "lucide-react";
import cover_select from "../assets/cover_select.png";
import showToast from "../utils/Toast";

const CreateNovelDialog = ({
  createNovelDialogOpen,
  setCreateNovelDialogOpen,
  isCreatingNovel,
  createNovel,
}) => {
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("original");
  const { tags, isLoadingTags, getTags } = useNovelStore();
  const [selectedTags, setSelectedTags] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (createNovelDialogOpen && !tags && !isLoadingTags) getTags();
  }, [createNovelDialogOpen, getTags, isLoadingTags, tags]);

  const clearInput = () => {
    setCoverImageFile(null);
    setCoverImage(null);
    setTitle("");
    setDescription("");
    setType("original");
  };

  const handleCreateNovel = async () => {
    if (
      await createNovel(coverImageFile, title, description, type, selectedTags)
    ) {
      showToast(t("novel_created"), "success");
      clearInput();
      setCreateNovelDialogOpen(false);
    }
  };

  return (
    <dialog open={createNovelDialogOpen} className="modal">
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
            <h3 className="font-bold text-xl mb-6">{t('create_novel')}</h3>

            <div className="space-y-5">
              {/* Cover Upload */}
              <div>
                <label className="label">
                  <span className="label-text font-medium mb-1">
                    {t('cover_image')}
                  </span>
                </label>

                <div className="flex items-center gap-4">
                  <div
                    className="cursor-pointer group relative"
                    onClick={() => fileInputRef.current.click()}
                  >
                    <img
                      src={coverImage ?? cover_select}
                      className="p-6 md:p-0 md:w-36 rounded-2xl object-cover shrink-0 shadow-md"
                    />
                    <SquarePen className="absolute size-5 opacity-0 group-hover:opacity-60 top-1 right-1 bg-base-100 text-base-content" />

                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setCoverImageFile(file);
                          setCoverImage(URL.createObjectURL(file));
                        }
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="label">
                  <span className="label-text font-medium mb-1">{t('title')}</span>
                </label>

                <input
                  type="text"
                  placeholder={t('enter_title')}
                  className="input input-bordered w-full"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Description */}
              <div>
                <label className="label">
                  <span className="label-text font-medium mb-1">
                    {t('description')}
                  </span>
                </label>

                <textarea
                  placeholder={t('enter_description')}
                  className="textarea textarea-bordered w-full h-32"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              {/* Novel Type */}
              <div className="flex gap-4">
                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="novelType"
                    value={'original'}
                    checked={type === "original"}
                    onChange={(e) => setType(e.target.value)}
                    className="radio"
                  />
                  <span>{t('original')}</span>
                </label>

                <label className="cursor-pointer flex items-center gap-2">
                  <input
                    type="radio"
                    name="novelType"
                    value={'translation'}
                    checked={type === "translation"}
                    onChange={(e) => setType(e.target.value)}
                    className="radio"
                  />
                  <span>{t('translation')}</span>
                </label>
              </div>

              {/* Tags */}
              <div>
                <label className="label">
                  <span className="label-text font-medium mb-1">{t('tags')}</span>
                </label>

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
                  setCreateNovelDialogOpen(false);
                  clearInput();
                }}
                disabled={isCreatingNovel}
              >
                {t("cancel")}
              </button>

              <button
                className="btn btn-primary"
                onClick={() => handleCreateNovel()}
                disabled={isCreatingNovel}
              >
                {isCreatingNovel ? (
                  <div className="min-w-10">
                    <span className="loading loading-spinner"></span>
                  </div>
                ) : (
                  t("create")
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </dialog>
  );
};

export default CreateNovelDialog;
