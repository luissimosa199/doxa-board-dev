import React, { useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";

const Example = () => {
  const [text, setText] = useState<string | null>(null);
  const editorRef = useRef<Editor["elementRef"] | null>(null);
  const log = () => {
    if (editorRef.current) {
      setText(editorRef.current.getContent());
    }
  };

  return (
    <div>
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
        onInit={(evt, editor) => (editorRef.current = editor)}
        initialValue="<p>This is the initial content of the editor.</p>"
        init={{
          height: 500,
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
            "link",
            "image",
            "charmap",
            "preview",
            "anchor",
            "visualblocks",
            "code",
            "fullscreen",
            "insertdatetime",
            "media",
            "table",
            "code",
            "help",
          ],
          toolbar: false,
          statusbar: false,
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
        }}
      />
      <button onClick={log}>Log editor content</button>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: text || "" }}
      ></div>
    </div>
  );
};

export default Example;
