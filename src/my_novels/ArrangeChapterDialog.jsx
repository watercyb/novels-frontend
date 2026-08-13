import { ArrowDownUp, X } from "lucide-react";
import useMyNovelStore from "./UseMyNovelStore";
import showToast from "../utils/Toast";
import { t } from "i18next";

export default function ArrangeChapterDialog({
  chapterToMove,
  setChapterToMove,
}) {
  const { novel, operation, moveChapter } = useMyNovelStore();

  if (!novel?.chapters || !chapterToMove) return null;

  return (
    <>
      {!operation && (
        <dialog open={chapterToMove} className="modal modal-open">
          <div className="modal-box max-w-2xl p-0">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-base-300">
              <div>
                <h3 className="font-bold text-xl flex items-center gap-2">
                  <ArrowDownUp className="size-5" />
                  {t("arrange_chapter")}
                </h3>

                <p className="text-sm text-base-content/70 mt-1">
                  {t("choose_chapter_position", { title: chapterToMove.title })}
                </p>
              </div>

              <button
                className="btn btn-ghost btn-circle"
                onClick={() => setChapterToMove(null)}
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Positions */}
            <div className="max-h-105 overflow-y-auto divide-y divide-base-300">
              {novel.chapters.map(
                (chapter, idx) =>
                  chapter.id != chapterToMove.id && (
                    <button
                      key={chapter.id}
                      className="w-full flex items-center justify-between px-6 py-4 hover:bg-base-200 transition text-left"
                      onClick={async () => {
                        if (await moveChapter(chapter.id, chapterToMove.id)) {
                          showToast(t("chapter_moved"), "success");
                          setChapterToMove(null);
                        }
                      }}
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="font-medium shrink-0">#{idx}</div>

                        <div className="font-medium truncate">
                          {idx == 0 ? t("move_to_beginning") : chapter.title}
                        </div>

                        <div className="text-sm text-base-content/60">
                          {idx == 0
                            ? t("before_all_chapters")
                            : t("place_after_this_chapter")}
                        </div>
                      </div>
                    </button>
                  ),
              )}
            </div>

            {/* Footer */}
            <div className="modal-action px-6 py-4 border-t border-base-300">
              <button className="btn" onClick={() => setChapterToMove(null)}>
                Cancel
              </button>
            </div>
          </div>

          <div
            className="modal-backdrop"
            onClick={() => setChapterToMove(null)}
          />
        </dialog>
      )}
    </>
  );
}
