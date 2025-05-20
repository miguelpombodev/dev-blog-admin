"use client";

import { useState } from "react";
import MarkdownPreview from "../../components/MarkdownPreview";

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title"
        className="w-full p-3 mb-4 rounded bg-neutral-800 border border-neutral-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Markdown content"
          className="h-96 p-4 rounded bg-neutral-800 border border-neutral-700"
        />
        <MarkdownPreview content={content} />
      </div>

      <button className="mt-6 bg-secondary text-black px-6 py-2 rounded font-semibold hover:opacity-90">
        Publish
      </button>
    </div>
  );
}
