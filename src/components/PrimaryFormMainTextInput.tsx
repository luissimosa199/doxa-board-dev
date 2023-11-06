import { TimelineFormInputs } from "@/types";
import { Editor } from "@tinymce/tinymce-react";
import React, { useEffect } from "react";
import { UseFormRegister, UseFormSetValue } from "react-hook-form";

const PrimaryFormMainTextInput = ({
  register,
  setValue,
  editorRef,
}: {
  register: UseFormRegister<TimelineFormInputs>;
  setValue: UseFormSetValue<TimelineFormInputs>;
  editorRef: React.MutableRefObject<any>;
}) => {
  useEffect(() => {
    register("mainText");
  }, [register]);

  return (
    <div className="w-full my-auto h-full">
      <Editor
        apiKey={process.env.NEXT_PUBLIC_TINY_MCE_API_KEY}
        onEditorChange={(content) => {
          setValue("mainText", content);
        }}
        textareaName="mainText"
        onInit={(evt, editor) => (editorRef.current = editor)}
        init={{
          invalid_styles: {
            "*": "position width",
          },
          invalid_classes: {
            "*": "sticky",
          },
          height: 100,
          placeholder: "Escribí algo acá",
          menubar: false,
          plugins: [
            "advlist",
            "autolink",
            "lists",
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
            "paste",
          ],
          paste_preprocess: function (plugin, args) {
            // args.content.replaceAll(""); // remove unwanted styles
          },
          toolbar: false,
          statusbar: false,
          content_style:
            "body { font-family:Helvetica,Arial,sans-serif; font-size:14px; cursor:text; position: static; }",
        }}
      />
    </div>
  );
};

export default PrimaryFormMainTextInput;
