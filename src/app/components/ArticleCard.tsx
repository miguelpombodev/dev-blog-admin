"use client";

import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import ResultModalComponent from "./ResultModal";
import { deleteTag } from "@/actions/tag.actions";
import { IArticleCardProps } from "@/interfaces/components/articleCard.interface";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import ArticleFormComponent from "./ArticleForm";
import { updateArticleAvatar } from "@/actions/createArticle";

export default function ArticleCardComponent({
  article,
  onDeleted,
}: IArticleCardProps) {
  const [openTagOptions, setOpenTagOptions] = useState(false);
  const tagOptionsRef = useRef<HTMLDivElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultModalMessage, setResultModalMessage] = useState("");
  const [resultModalSuccess, setResultModalSuccess] = useState(false);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tagOptionsRef.current &&
        !tagOptionsRef.current.contains(event.target as Node)
      ) {
        setOpenTagOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  async function handleDeleteTag(tagName: string) {
    try {
      await deleteTag(tagName);

      setResultModalMessage("Tag deleted successfully!");
      setResultModalSuccess(true);
      setResultModalOpen(true);

      if (onDeleted) {
        onDeleted();
      }
    } catch {
      setResultModalMessage("An error occurred while deleting the tag.");
      setResultModalSuccess(false);
      setResultModalOpen(true);
    }
  }

  return (
    <Card key={article._id} className="relative flex gap-10 justify-between">
      <CardContent className="flex justify-between items-center">
        <div className="flex gap-5">
          <div
            className="relative group w-auto h-auto cursor-pointer"
            onClick={() => setImageModalOpen(true)}
          >
            <Image
              src={article.articleImageSrc}
              alt={article.title}
              width={100}
              height={50}
              className="rounded-[10px] object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-[10px] opacity-0 group-hover:opacity-40 flex items-center justify-center transition-opacity duration-300 text-center">
              <span className="text-white text-sm font-semibold">
                Update Avatar Image
              </span>
            </div>
          </div>
          <span className="flex flex-col gap-1">
            <h2 className="text-xl font-bold">{article.title}</h2>
            <p>
              <span className="font-bold">Description:</span>{" "}
              {article.briefDescription}
            </p>
            <p>
              <span className="font-bold">Slug:</span> {article.slug}
            </p>
          </span>
        </div>
        <EllipsisVertical
          onClick={() => {
            setOpenTagOptions((prev) => !prev);
          }}
          className="cursor-pointer"
          width={20}
          height={20}
        />
        {openTagOptions && (
          <div
            ref={tagOptionsRef}
            className="absolute top-[54%] right-0 z-10 mt-2 w-32 bg-white border border-black rounded-md shadow-md flex flex-col text-sm"
          >
            <button
              className="p-2 bg-secondary text-white px-6 py-2 font-semibold hover:opacity-90 cursor-pointer"
              onClick={() => setEditModalOpen(true)}
            >
              Edit
            </button>
            <button
              className="p-2 bg-destructive text-white px-6 py-2 font-semibold hover:opacity-90 cursor-pointer"
              onClick={() => setDeleteModalOpen(true)}
            >
              Delete
            </button>
          </div>
        )}
        <Modal
          title="Edit Tag - Teste"
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
        >
          <ArticleFormComponent
            editMode
            key={article.title}
            articleId={article.slug}
          />
        </Modal>
        <Modal
          title="Delete Tag - Teste"
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <h1>
            ARE YOU SURE YOU WANT TO DELETE THE ARTICLE{" "}
            <strong>{article.title}</strong>?
          </h1>
          <button
            className="mt-2 bg-red-600 text-white px-6 py-2 rounded font-semibold hover:opacity-90 cursor-pointer"
            onClick={() => handleDeleteTag(article.title)}
          >
            Delete
          </button>
          <button
            className="mt-2 bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90 cursor-pointer"
            onClick={() => setDeleteModalOpen(false)}
          >
            Cancel
          </button>
        </Modal>
        <ResultModalComponent
          isOpen={resultModalOpen}
          onClose={() => setResultModalOpen(false)}
          isSuccess={resultModalSuccess}
          message={resultModalMessage}
        />
        <Modal
          title="Update Article Image"
          isOpen={imageModalOpen}
          onClose={() => setImageModalOpen(false)}
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const fileInput = e.currentTarget.elements.namedItem(
                "image"
              ) as HTMLInputElement;
              const file = fileInput.files?.[0];
              if (file) {
                await updateArticleAvatar(file, article.slug);
              }
              setImageModalOpen(false);
            }}
            className="flex flex-col gap-4"
          >
            <input type="file" name="image" accept="image/*" required />
            <div className="flex gap-2 justify-end">
              <button
                type="submit"
                className="bg-primary text-white px-4 py-2 rounded hover:opacity-90"
              >
                Upload
              </button>
              <button
                type="button"
                className="bg-secondary text-white px-4 py-2 rounded hover:opacity-90"
                onClick={() => setImageModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      </CardContent>
    </Card>
  );
}
