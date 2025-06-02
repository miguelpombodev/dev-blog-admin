import { createTagSchema, createTagSchemaFormData } from "@/schemas/tag.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";
import { useForm } from "react-hook-form";
import ResultModalComponent from "./ResultModal";
import { ITagFormComponentProps } from "@/interfaces/components/forms.components";
import { createTag, updateTag } from "@/actions/tag.actions";

export function TagFormComponent({
  tagTitle,
  editMode = false,
  onFinishedSubmit,
}: ITagFormComponentProps) {
  const [tagColor, setTagColor] = useState<string>("#000");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      if (editMode) {
        await updateTag(data);
        setModalMessage("Tag updated successfully!");
        setModalSuccess(true);
        reset();
        return;
      }

      await createTag(data);
      setModalMessage("Tag created successfully!");
      setModalSuccess(true);
      reset();

      if (onFinishedSubmit) {
        onFinishedSubmit();
      }
    } catch (error) {
      if (error instanceof Error) {
        setError("An error occurred while creating the article.");
        setModalSuccess(false);
      }
    } finally {
      setModalOpen(true);
    }
  }
  return (
    <>
      <form onSubmit={handleSubmit(formOnSubmit)}>
        <div className="flex gap-5 items-center">
          <input
            placeholder="Tag Title"
            className="w-2/3 h-15 p-3 mb-4 rounded border border-neutral-700"
            value={tagTitle && tagTitle}
            readOnly
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
                    {
                      shouldValidate: true,
                    }
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
      <ResultModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSuccess={modalSuccess}
        message={error || modalMessage}
      />
    </>
  );
}
