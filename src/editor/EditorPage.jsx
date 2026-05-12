import { Editor } from "@tinymce/tinymce-react";
import { useState } from "react";

const EditorPage = () => {
  const [content, setContent] = useState("");

  return (
    <div>
      <Editor
        apiKey={import.meta.env.VITE_TINY_KEY}
        value={content}
        onEditorChange={(newValue) => setContent(newValue)}
        init={{
          height: 600,
          menubar: false,
          plugins: ["lists", "link", "table", "wordcount"],
          toolbar:
            "undo redo | bold italic underline strikethrough | forecolor backcolor | fontsize | alignleft aligncenter alignright | bullist numlist",
          font_size_formats: "12pt 14pt 16pt 18pt 24pt",
        }}
      />

      <div>{content}</div>
    </div>
  );
};

export default EditorPage;
