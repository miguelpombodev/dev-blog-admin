"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { ITag } from "@/interfaces/http/articles.interface";
import { getTags } from "@/actions/article.actions";
import Spinner from "@/app/components/Spinner";
import TagComponent from "@/app/components/TagCard";
import Modal from "@/app/components/Modal";
import { TagFormComponent } from "@/app/components/TagForm";
import ResultModalComponent from "@/app/components/ResultModal";

export default function CreateTagPage() {
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [createNewTagModalOpen, setCreateNewTagModalOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        <TagFormComponent
          onFinishedSubmit={() => {
            refreshTags();
            setCreateNewTagModalOpen(false);
          }}
        />
      </Modal>

      {isPending ? (
        <Spinner />
      ) : (
        <div className="flex min-h-[100] flex-col gap-5 bg-white rounded-[10] p-8 shadow-[6px_7px_6px_0px_rgba(0,_0,_0,_0.1)]">
          <h1 className="text-3xl font-bold mb-6">Available Tags</h1>
          {!availableTags.length ? (
            <h3>There are no tags available or registered</h3>
          ) : (
            availableTags.map((tag) => (
              <TagComponent key={tag.name} tag={tag} onDeleted={refreshTags} />
            ))
          )}
        </div>
      )}
      <ResultModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSuccess={false}
        message={error || ""}
      />
    </section>
  );
}
