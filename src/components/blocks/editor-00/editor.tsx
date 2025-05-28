"use client";

import { $generateHtmlFromNodes } from "@lexical/html";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { EditorState } from "lexical";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error("Lexical Editor Error:", error);
  },
};

function EditorChangeHandler({
  onChange,
}: {
  onChange?: (html: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  return (
    <OnChangePlugin
      onChange={() => {
        editor.update(() => {
          const htmlString = $generateHtmlFromNodes(editor);
          onChange?.(htmlString); // ✅ envia HTML como string
        });
      }}
    />
  );
}

export function Editor({
  editorState,
  onChange,
}: {
  editorState?: EditorState;
  onChange?: (html: string) => void;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-background shadow flex flex-1">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
        }}
      >
        <TooltipProvider>
          <Plugins />
          <EditorChangeHandler onChange={onChange} />
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
