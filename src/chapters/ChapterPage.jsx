import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useChapterStore from "./UseChapterStore";
import NotFoundPage from "../main/NotFoundPage";
import Content from "./Content";

const ChapterPage = () => {
  const { chapterId } = useParams();
  const { chapter, prvTitle, nextTitle, isLoadingChapter, getChapter } =
    useChapterStore();

  useEffect(() => {
    getChapter(chapterId);
  }, [chapterId, getChapter]);

  const cleanHTML = DOMPurify.sanitize(chapter?.content ?? "");

  return (
    <>
      {/* Loading */}
      {isLoadingChapter && !chapter && (
        <div className="flex justify-center py-20">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {/* No Novel */}
      {!isLoadingChapter && !chapter && <NotFoundPage />}
      {!isLoadingChapter && chapter && (
        <div className="flex justify-center items-center">
          <div className="max-w-3xl">
            <Content content={cleanHTML} />
          </div>
        </div>
      )}
    </>
  );
};

export default ChapterPage;
