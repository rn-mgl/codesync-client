import {
  useEditor,
  EditorContent,
  useEditorState,
  EditorStateSnapshot,
  Editor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { Activity } from "react";
import { FaEraser } from "react-icons/fa";
import {
  FaArrowTurnDown,
  FaBold,
  FaChevronDown,
  FaCode,
  FaItalic,
  FaList,
  FaListOl,
  FaQuoteLeft,
  FaRegWindowMinimize,
  FaStrikethrough,
} from "react-icons/fa6";
import Select from "./Select";

type HeaderType = 1 | 2 | 3 | 4 | 5 | 6;

const RichTextEditor = () => {
  const [isActiveHeaderOptions, setIsActiveHeaderOptions] =
    React.useState(false);
  const [headerType, setHeaderType] = React.useState<HeaderType>(1);

  // editor instance
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello</p>",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "max-h-full min-h-60 h-full w-full bg-inherit p-2 rounded-md outline-none rounded-t-none border-2 border-t border-neutral-400 overflow-y-auto",
      },
    },
  });

  // state tracker of editor to handle ui changes
  const editorState = useEditorState({
    editor,
    selector: (context: EditorStateSnapshot<Editor | null>) => {
      return {
        // text formatting
        // "is" - boolean if active
        // "can" - boolean if can activate
        isBold: context.editor?.isActive("bold") ?? false,
        canBold: context.editor?.can().chain().toggleBold().run() ?? false,
        isItalic: context.editor?.isActive("italic") ?? false,
        canItalic: context.editor?.can().chain().toggleItalic().run() ?? false,
        isStrike: context.editor?.isActive("strike") ?? false,
        canStrike: context.editor?.can().chain().toggleStrike().run() ?? false,
        isCode: context.editor?.isActive("code") ?? false,
        canCode: context.editor?.can().chain().toggleCode().run() ?? false,
        canClearMarks:
          context.editor?.can().chain().unsetAllMarks().run() ?? false,

        // block types
        isParagraph: context.editor?.isActive("paragraph") ?? false,
        isHeading1: context.editor?.isActive("heading", { level: 1 }) ?? false,
        isHeading2: context.editor?.isActive("heading", { level: 2 }) ?? false,
        isHeading3: context.editor?.isActive("heading", { level: 3 }) ?? false,
        isHeading4: context.editor?.isActive("heading", { level: 4 }) ?? false,
        isHeading5: context.editor?.isActive("heading", { level: 5 }) ?? false,
        isHeading6: context.editor?.isActive("heading", { level: 6 }) ?? false,

        // history
        canUndo: context.editor?.can().chain().undo().run() ?? false,
        canRedo: context.editor?.can().chain().redo().run() ?? false,
      };
    },
  });

  const handleHeaderType = (type: HeaderType) => {
    setHeaderType(type);
  };

  const handleIsActiveHeaderOptions = () => {
    setIsActiveHeaderOptions((prev) => !prev);
  };

  const headers: HeaderType[] = [1, 2, 3, 4, 5, 6];

  const mappedHeaderTypes =
    editor &&
    headers.map((type) => {
      return (
        <button
          type="button"
          key={type}
          className="bg-inherit p-2.5 font-medium text-sm w-full first:rounded-t-md last:rounded-b-md"
          onClick={() => {
            editor.chain().focus().toggleHeading({ level: type }).run();
            handleHeaderType(type);
          }}
        >
          H{type}
        </button>
      );
    });

  return (
    <div className="w-full flex flex-col items-center justify-start h-full overflow-y-hidden">
      {editor && (
        <div className="w-full flex flex-row bg-inherit border-2 border-neutral-400 rounded-t-md border-b ">
          <div className="relative w-20 rounded-tl-md flex flex-col items-center justify-center">
            <button
              type="button"
              className="rounded-tl-md p-2.5 font-medium text-sm w-full"
              onClick={handleIsActiveHeaderOptions}
            >
              H{headerType}
            </button>

            <Activity mode={isActiveHeaderOptions ? "visible" : "hidden"}>
              <div
                className="absolute flex flex-col rounded-md items-center justify-center 
                            top-0 translate-y-10.5 w-full bg-neutral-200 z-30"
              >
                {mappedHeaderTypes}
              </div>
            </Activity>

            <FaChevronDown className="absolute right-2 text-xs" />
          </div>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleBold().run()}
          >
            <FaBold />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleItalic().run()}
          >
            <FaItalic />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleCode().run()}
          >
            <FaCode />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleStrike().run()}
          >
            <FaStrikethrough />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
          >
            <FaList />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
          >
            <FaListOl />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs "
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          >
            <FaCode className="bg-primary text-secondary text-base rounded-sm p-0.5" />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
          >
            <FaQuoteLeft />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
          >
            <FaRegWindowMinimize />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().setHardBreak().run()}
          >
            <FaArrowTurnDown className="rotate-90" />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
          >
            <FaEraser />
          </button>

          <button
            type="button"
            className="bg-inherit p-2.5 text-xs"
            onClick={() => editor.chain().focus().clearNodes().run()}
          >
            <FaEraser className="bg-primary text-secondary text-base rounded-sm p-0.5" />
          </button>
        </div>
      )}

      <div className="w-full h-full overflow-y-hidden prose max-w-none">
        <EditorContent
          editor={editor}
          className="w-full max-h-full h-full overflow-y-hidden"
        />
      </div>
    </div>
  );
};

export default RichTextEditor;
