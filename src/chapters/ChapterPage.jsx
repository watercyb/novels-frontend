import DOMPurify from "dompurify";

const ChapterPage = () => {
  const cleanHTML = DOMPurify.sanitize("");

  return <div dangerouslySetInnerHTML={{ __html: cleanHTML }} />;
};

export default ChapterPage;
