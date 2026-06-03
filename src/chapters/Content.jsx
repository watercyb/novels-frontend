const Content = ({ content }) => {
  return (
    <>
      <div
        className="
            prose prose-md max-w-none

            prose-headings:text-base-content
            prose-p:text-base-content
            prose-a:text-primary
            prose-a:no-underline hover:prose-a:underline
            prose-strong:text-base-content
            prose-code:text-secondary

            prose-blockquote:border-primary
            prose-blockquote:bg-base-200
            prose-blockquote:px-4
            prose-blockquote:py-2

            prose-table:border
            prose-th:bg-base-200
            prose-th:border
            prose-td:border

            prose-img:rounded-lg
        "
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </>
  );
};

export default Content;
