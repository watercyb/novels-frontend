import { Editor } from "@tinymce/tinymce-react";

const ChapterEditor = ({ content, setContent }) => {
  const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;;

  return (
    <div>
      <Editor
        key={isDark ? "dark" : "light"}
        apiKey={import.meta.env.VITE_TINY_KEY}
        value={content}
        onEditorChange={(newValue) => setContent(newValue)}
        init={{
          height: 600,
          menubar: false,
          skin: isDark ? "oxide-dark" : "oxide",
          content_css: isDark ? "dark" : "default",
          plugins: ["lists", "link", "table", "wordcount"],
          toolbar:
            "undo redo | bold italic underline strikethrough | forecolor backcolor | fontsize | alignleft aligncenter alignright | bullist numlist",
          font_size_formats: "12pt 14pt 16pt 18pt 24pt",
        }}
      />
    </div>
  );
};

export default ChapterEditor;
