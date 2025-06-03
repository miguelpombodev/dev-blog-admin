"use client";

import { EllipsisVertical } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import ResultModalComponent from "./ResultModal";
import { TagFormComponent } from "./TagForm";
import { deleteTag } from "@/actions/tag.actions";
import { IArticleCardProps } from "@/interfaces/components/articleCard.interface";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";

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
        <div className="flex">
          <Image
            src={article.articleImageSrc}
            alt={article.title}
            width={50}
            height={50}
          />
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
          <TagFormComponent editMode tagTitle={article.title} />
        </Modal>
        <Modal
          title="Delete Tag - Teste"
          isOpen={deleteModalOpen}
          onClose={() => setDeleteModalOpen(false)}
        >
          <h1>
            ARE YOU SURE YOU WANT TO DELETE THE TAG{" "}
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
      </CardContent>
    </Card>
  );
}
