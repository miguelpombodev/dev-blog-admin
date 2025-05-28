"use client";

import { useState, useEffect } from "react";
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
import Modal from "@/app/components/Modal";
import { ITag } from "@/interfaces/http/articles.interface";
import { getTags } from "@/actions/article.actions";

type FormData = z.infer<typeof createArticleSchema>;

export default function CreateArticlePage() {
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [currentValue, setCurrentValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(createArticleSchema),
  });

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    formState: { errors },
  } = form;

  useEffect(() => {
    const getAllTags = async (): Promise<void> => {
      const tags = await getTags();
      setAvailableTags(tags);
    };
    getAllTags();
  }, []);

  const handleAddTag = (value: string) => {
    const tag = availableTags.find((tag) => tag.name === value);
    if (!tag) return;
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter((v) => v.name !== tag.name)
      : [...selectedTags, tag];

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
      setModalMessage("Article created successfully!");
      setModalSuccess(true);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setModalMessage("An error occurred while creating the article.");
        setModalSuccess(false);
      }
    } finally {
      setModalOpen(true);
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
              <option key={tag.name} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          <div className="flex flex-col gap-2 rounded-[10] bg-white flex-1 min-h-16 justify-center items-center">
            {selectedTags.length === 0 ? (
              <p className="text-center m-auto">Sem tags escolhidas</p>
            ) : (
              selectedTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex font-semibold my-auto w-1/2 justify-between border-b border-black items-center p-2"
                >
                  <span>{tag.name}</span>
                  <span
                    style={{ backgroundColor: tag.color }}
                    className="w-[80] h-[8] rounded-full"
                  />
                </div>
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSuccess={modalSuccess}
        message={modalMessage}
      />
    </div>
  );
}
