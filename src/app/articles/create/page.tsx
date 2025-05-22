"use client";

import { useState } from "react";
import MarkdownPreview from "../../components/MarkdownPreview";

export default function CreateArticlePage() {
  const [title, setTitle] = useState("");
  const [briefDescription, setBriefDescription] = useState("");
  const [slug, setSlug] = useState("");
  const [imagePath, setImagePath] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [currentValue, setCurrentValue] = useState<string>("");

  const availableTags = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
  ];

  const handleAddTag = (value: string) => {
    if (selectedTags.includes(value)) {
      setSelectedTags(selectedTags.filter((v) => v !== value));
      return;
    }

    if (value && !selectedTags.includes(value)) {
      setSelectedTags((prev) => [...prev, value]);
    }

    console.log(selectedTags);
    setCurrentValue(""); // limpa a seleção
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Article title"
        className="w-full p-3 mb-4 rounded  border border-neutral-700"
      />

      <input
        value={briefDescription}
        onChange={(e) => setBriefDescription(e.target.value)}
        placeholder="Article brief description"
        className="w-full p-3 mb-4 rounded  border border-neutral-700"
      />

      <input
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        placeholder="Article slug"
        className="w-full p-3 mb-4 rounded  border border-neutral-700"
      />

      <input
        type="file"
        value={imagePath}
        onChange={(e) => setImagePath(e.target.value)}
        placeholder="Article image to be shown"
        className="w-full p-3 mb-4 rounded  border border-neutral-700"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Markdown content"
          className="h-96 p-4 rounded  border border-neutral-700"
        />
        <MarkdownPreview content={content} />
      </div>
      <div className="flex items-center gap-10 mt-10">
        <select
          value={currentValue}
          onChange={(e) => handleAddTag(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="">Selecione uma tag</option>
          {availableTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </select>
        <div className="flex flex-col gap-5 border-1 border-black rounded-[10] p-5 w-1/4">
          {selectedTags.length === 0 ? (
            <p>Sem tags escolhidas</p>
          ) : (
            selectedTags.map((tag, idx) => (
              <p className="font-black pb-2 border-b-1" key={idx}>
                {tag}
              </p>
            ))
          )}
        </div>
      </div>
      <button className="mt-6 cursor-pointer bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90">
        Publish
      </button>
    </div>
  );
}
