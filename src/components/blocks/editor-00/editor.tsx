"use client";

import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import {
  InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $getRoot, EditorState } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect, useRef } from "react";

import { editorTheme } from "@/components/editor/themes/editor-theme";
import { TooltipProvider } from "@/components/ui/tooltip";

import { nodes } from "./nodes";
import { Plugins } from "./plugins";
import { FloatingLinkContext } from "@/components/editor/context/floating-link-context";

const editorConfig: InitialConfigType = {
  namespace: "Editor",
  theme: editorTheme,
  nodes,
  onError: (error: Error) => {
    console.error("Lexical Editor Error:", error);
  },
};

function EditorLoader({ initialHTML }: { initialHTML?: string }) {
  const [editor] = useLexicalComposerContext();
  const isLoadedRef = useRef(false);

  useEffect(() => {
    if (!initialHTML || isLoadedRef.current) return;

    isLoadedRef.current = true;

    editor.update(() => {
      const parser = new DOMParser();
      const dom = parser.parseFromString(initialHTML, "text/html");
      const nodes = $generateNodesFromDOM(editor, dom);
      const root = $getRoot();
      root.clear();
      root.append(...nodes);
    });
  }, [editor, initialHTML]);

  return null;
}
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
          onChange?.(htmlString);
        });
      }}
    />
  );
}

export function Editor({
  editorState,
  initialHTML,
  onChange,
}: {
  editorState?: EditorState;
  initialHTML?: string;
  onChange?: (html: string) => void;
}) {
  return (
    <div className="m-h-4 overflow-hidden rounded-lg border bg-background shadow flex flex-1">
      <LexicalComposer
        initialConfig={{
          ...editorConfig,
          ...(editorState ? { editorState } : {}),
        }}
      >
        <TooltipProvider>
          <FloatingLinkContext>
            <Plugins />
            <EditorChangeHandler onChange={onChange} />
            <EditorLoader initialHTML={initialHTML} />
          </FloatingLinkContext>
        </TooltipProvider>
      </LexicalComposer>
    </div>
  );
}
