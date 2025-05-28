"use client";

import { useState } from "react";
import { Editor } from "@/components/blocks/editor-00/editor";
import {
  createArticleSchema,
  createArticleSchemaForApi,
} from "@/schemas/article.schema";
import z from "zod";
import { useForm } from "react-hook-form";
import { createArticle } from "@/actions/createArticle";
import { zodResolver } from "@hookform/resolvers/zod";
import { EditorState } from "lexical";

type FormData = z.infer<typeof createArticleSchema>;

export default function CreateArticlePage() {
  const [currentValue, setCurrentValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(createArticleSchema),
  });

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = form;

  const availableTags = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
  ];

  const handleAddTag = (value: string) => {
    if (!value) return;
    const newTags = selectedTags.includes(value)
      ? selectedTags.filter((v) => v !== value)
      : [...selectedTags, value];

    setSelectedTags(newTags);
    setValue("tags", newTags);
    setCurrentValue("");
  };

  async function componentOnSubmit(data: FormData) {
    try {
      const fileName = data.articleImageSrc.item(0)?.name;
      const safeParsedData = createArticleSchemaForApi.safeParse({
        ...data,
        articleImageSrc: fileName,
      });

      if (!safeParsedData.success) {
        console.error(safeParsedData.error);
        return;
      }

      await createArticle(safeParsedData.data);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }

      throw error;
    }
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

      <form onSubmit={handleSubmit(componentOnSubmit)}>
        <input
          placeholder="Article title"
          className="w-full p-3 mb-4 rounded border border-neutral-700"
          {...register("title")}
        />
        {errors.title && <p className="text-red-600">{errors.title.message}</p>}

        <input
          placeholder="Article brief description"
          className="w-full p-3 mb-4 rounded border border-neutral-700"
          {...register("briefDescription")}
        />
        {errors.briefDescription && (
          <p className="text-red-600">{errors.briefDescription.message}</p>
        )}

        <input
          placeholder="Article slug"
          className="w-full p-3 mb-4 rounded border border-neutral-700"
          {...register("slug")}
        />
        {errors.slug && <p className="text-red-600">{errors.slug.message}</p>}

        <input
          type="file"
          className="w-full p-3 mb-4 rounded border border-neutral-700"
          {...register("articleImageSrc", {
            required: true,
          })}
        />
        {errors.articleImageSrc && (
          <p className="text-red-600">{errors.articleImageSrc.message}</p>
        )}

        <div className="mt-6">
          <Editor
            onChange={(html) =>
              setValue("content", html as EditorState, { shouldValidate: true })
            }
          />
          {errors.content && (
            <p className="text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="flex items-center gap-10 mt-10">
          <select
            value={currentValue}
            className="border px-3 py-2 rounded"
            onChange={(e) => handleAddTag(e.target.value)}
          >
            <option value="">Selecione uma tag</option>
            {availableTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>

          <div className="flex flex-col gap-2">
            {selectedTags.length === 0 ? (
              <p>Sem tags escolhidas</p>
            ) : (
              selectedTags.map((tag, idx) => (
                <span key={idx} className="font-semibold border-b">
                  {tag}
                </span>
              ))
            )}
          </div>
        </div>

        <button
          className="mt-6 bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90"
          type="submit"
        >
          Publish
        </button>
      </form>
    </div>
  );
}
