"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTagSchema, createTagSchemaFormData } from "@/schemas/tag.schema";

import { useCallback, useEffect, useState, useTransition } from "react";
import { HexColorPicker } from "react-colorful";
import { createTag } from "@/actions/tag.actions";
import { ITag } from "@/interfaces/http/articles.interface";
import { getTags } from "@/actions/article.actions";
import Spinner from "@/app/components/Spinner";
import TagComponent from "@/app/components/TagCard";
import ResultModalComponent from "@/app/components/ResultModal";
import Modal from "@/app/components/Modal";

export default function CreateTagPage() {
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [tagColor, setTagColor] = useState<string>("#000");
  const [createNewTagModalOpen, setCreateNewTagModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modalSuccess, setModalSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<createTagSchemaFormData>({
    resolver: zodResolver(createTagSchema),
  });

  useEffect(() => {
    startTransition(async (): Promise<void> => {
      try {
        const tags = await getTags();
        setAvailableTags(tags);
      } catch {
        setError("Erro ao carregar informações do painel.");
        setModalOpen(true);
      }
    });
  }, []);

  async function formOnSubmit(data: createTagSchemaFormData) {
    try {
      await createTag(data);
      setModalMessage("Tag created successfully!");
      setModalSuccess(true);
      reset();

      const updatedTags = await getTags();
      setAvailableTags(updatedTags);
    } catch (error) {
      if (error instanceof Error) {
        setModalMessage("An error occurred while creating the article.");
        setModalSuccess(false);
      }
    } finally {
      setModalOpen(true);
    }
  }

  const refreshTags = useCallback(async () => {
    const updatedTags = await getTags();
    setAvailableTags(updatedTags);
  }, []);

  return (
    <section className="flex flex-col gap-5">
      <span className="flex justify-between items-baseline">
        <h1 className="text-3xl font-bold mb-6">Tags Management</h1>
        <button
          className="mt-6 bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90 cursor-pointer"
          onClick={() => setCreateNewTagModalOpen(true)}
        >
          Create New Tag
        </button>
      </span>
      <Modal
        title="Create New Tag"
        isOpen={createNewTagModalOpen}
        onClose={() => setCreateNewTagModalOpen(false)}
      >
        <form onSubmit={handleSubmit(formOnSubmit)}>
          <div className="flex gap-5 items-center">
            <input
              placeholder="Tag Title"
              className="w-2/3 h-15 p-3 mb-4 rounded border border-neutral-700"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
            <span>
              <HexColorPicker
                color={tagColor}
                onChange={(e) => {
                  setTagColor(e);
                  setValue("color", e, { shouldValidate: true });
                }}
              />
              <input
                type="text"
                value={tagColor}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^#?[0-9A-Fa-f]{0,6}$/.test(value)) {
                    setTagColor(value.startsWith("#") ? value : `#${value}`);
                    setValue(
                      "color",
                      value.startsWith("#") ? value : `#${value}`,
                      { shouldValidate: true }
                    );
                  }
                }}
                className="border px-2 py-1 rounded mt-2"
              />
            </span>
            {errors.title && (
              <p className="text-red-600">{errors.title.message}</p>
            )}
          </div>
          <button
            className="mt-6 bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90 cursor-pointer"
            type="submit"
          >
            Publish
          </button>
        </form>
      </Modal>

      <ResultModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSuccess={modalSuccess}
        message={error || modalMessage}
      />

      {isPending ? (
        <Spinner />
      ) : (
        <div className="flex min-h-[100] flex-col gap-5 bg-white rounded-[10] p-8 shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
          <h1 className="text-3xl font-bold mb-6">Available Tags</h1>
          {!availableTags ? (
            <h3>There are no tags available or registered</h3>
          ) : (
            availableTags.map((tag) => (
              <TagComponent key={tag.name} tag={tag} onDeleted={refreshTags} />
            ))
          )}
        </div>
      )}
    </section>
  );
}
