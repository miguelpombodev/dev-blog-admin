"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTagSchema, createTagSchemaFormData } from "@/schemas/tag.schema";

import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { createTag } from "@/actions/tag.actions";
import Modal from "@/app/components/Modal";

export default function CreateTagPage() {
  const [tagColor, setTagColor] = useState<string>("#000");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<createTagSchemaFormData>({
    resolver: zodResolver(createTagSchema),
  });

  async function formOnSubmit(data: createTagSchemaFormData) {
    try {
      await createTag(data);
      setModalMessage("Tag created successfully!");
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
    <section className="flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

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
          <HexColorPicker
            color={tagColor}
            onChange={(e) => {
              setTagColor(e);
              setValue("color", e, { shouldValidate: true });
            }}
          />
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
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSuccess={modalSuccess}
        message={modalMessage}
      />
    </section>
  );
}
