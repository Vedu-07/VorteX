// "use client";

// import { useTheme } from "next-themes";
// import { PartialBlock } from "@blocknote/core";
// import { BlockNoteViewRaw, useCreateBlockNote, useEditorChange } from "@blocknote/react";
// import "@blocknote/core/style.css";

// import { useEdgeStore } from "@/lib/edgestore";

// interface EditorProps {
//   onChange: (value: string) => void;
//   initialContent?: string;
//   editable?: boolean;
// }

// const Editor = ({
//   onChange,
//   initialContent,
//   editable = true, // Default to true if not provided
// }: EditorProps) => {
//   const { resolvedTheme } = useTheme();
//   const { edgestore } = useEdgeStore();

//   // Handle file upload to EdgeStore
//   const handleUpload = async (file: File) => {
//     const response = await edgestore.publicFiles.upload({ file });
//     return response.url;
//   };

//   // Create the BlockNote editor instance using useCreateBlockNote
//   const editor = useCreateBlockNote({
//     initialContent: initialContent ? (JSON.parse(initialContent) as PartialBlock[]) : undefined,
//     uploadFile: handleUpload,
//   });

//   // Use the useEditorChange hook to handle editor content changes
//   useEditorChange(editor, () => {
//     if (editable) {
//       onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
//     }
//   });

//   return (
//     <div>
//       {/* Remove the onChange prop and use only editor */}
//       <BlockNoteViewRaw
//         editor={editor}
//         theme={resolvedTheme === "dark" ? "dark" : "light"}
//         className={editable ? "" : "blocknote-readonly"}
//       />
//       <style jsx>{`
//         .blocknote-readonly {
//           pointer-events: none; /* Prevent interaction */
//           opacity: 0.6; /* Indicate read-only visually */
//         }
//       `}</style>
//     </div>
//   );
// };

// export default Editor;


"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { useCreateBlockNote } from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import { useTheme } from "next-themes";
import { useEdgeStore } from "@/lib/edgestore";
import "@blocknote/core/style.css";
import "@blocknote/mantine/style.css";

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();

  const { edgestore } = useEdgeStore();

  const handleUpload = async (file: File) => {
    const res = await edgestore.publicFiles.upload({
      file,
    });

    return res.url;
  };

  const editor: BlockNoteEditor = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    uploadFile: handleUpload,
  });
  // HandleChange Function Sperated From Editor Component
  const handleEditorChange = () => {
    onChange(JSON.stringify(editor.document, null, 2));
  };

  return (
    <div>
      <BlockNoteView
        editable={editable}
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
        onChange={handleEditorChange}
      />
    </div>
  );
};

export default Editor;