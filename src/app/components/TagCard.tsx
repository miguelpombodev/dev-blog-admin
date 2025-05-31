"use client";

import { EllipsisVertical } from "lucide-react";
import { ITagCardProps } from "@/interfaces/components/tagCard.interface";
import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";
import { deleteTag } from "@/actions/tag.actions";
import ResultModalComponent from "./ResultModal";

export default function TagComponent({ tag, onDeleted }: ITagCardProps) {
  const [openTagOptions, setOpenTagOptions] = useState(false);
  const tagOptionsRef = useRef<HTMLDivElement>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [resultModalMessage, setresultModalMessage] = useState("");
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
      setresultModalMessage("Tag deleted successfully!");
      setResultModalSuccess(true);
      setResultModalOpen(true);

      if (onDeleted) {
        onDeleted();
      }
    } catch {
      setresultModalMessage("An error occurred while deleting the tag.");
      setResultModalSuccess(false);
      setResultModalOpen(true);
    }
  }

  return (
    <span key={tag.name} className="relative flex gap-10 justify-between">
      <p className="w-[200]">{tag.name}</p>
      <span
        style={{ backgroundColor: tag.color }}
        className="w-[80] h-[8] rounded-full"
      />
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
          className="absolute top-full right-0 z-10 mt-2 w-32 bg-white border border-black rounded-md shadow-md flex flex-col text-sm"
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
        <p>edit</p>
      </Modal>
      <Modal
        title="Delete Tag - Teste"
        isOpen={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      >
        <h1>
          ARE YOU SURE YOU WANT TO DELETE THE TAG <strong>{tag.name}</strong>?
        </h1>
        <button
          className="mt-2 bg-red-600 text-white px-6 py-2 rounded font-semibold hover:opacity-90 cursor-pointer"
          onClick={() => handleDeleteTag(tag.name)}
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
    </span>
  );
}
