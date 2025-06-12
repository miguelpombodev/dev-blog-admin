import { getArticleBySlug, getTags } from "@/actions/article.actions";
import {
  saveArticle,
  updateArticle,
  updateArticleAvatar,
} from "@/actions/createArticle";
import { Editor } from "@/components/blocks/editor-00/editor";
import { IArticle, ITag } from "@/interfaces/http/articles.interface";
import { createArticleSchema } from "@/schemas/article.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { $getRoot, createEditor, EditorState } from "lexical";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import ResultModalComponent from "./ResultModal";
import { X } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { $generateHtmlFromNodes, $generateNodesFromDOM } from "@lexical/html";
import { nodes } from "@/components/blocks/editor-00/nodes";
import debounce from "lodash.debounce";

type FormData = z.infer<typeof createArticleSchema>;

interface Props {
  editMode?: boolean;
  articleId?: string;
}

export default function ArticleFormComponent({
  editMode = false,
  articleId,
}: Props) {
  const [availableTags, setAvailableTags] = useState<ITag[]>([]);
  const [oldArticle, setOldArticle] = useState<IArticle>();
  const [currentValue, setCurrentValue] = useState("");
  const [selectedTags, setSelectedTags] = useState<ITag[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalSuccess, setModalSuccess] = useState(false);
  const [initialEditorState, setInitialEditorState] = useState<
    EditorState | undefined
  >(undefined);

  const {
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    getValues,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createArticleSchema),
    defaultValues: {
      _editMode: editMode,
    },
  });

  const isPublished = watch("isPublished");

  useEffect(() => {
    setValue("_editMode", editMode);
  }, [editMode, setValue]);

  useEffect(() => {
    const loadFormData = async () => {
      const tags = await getTags();
      setAvailableTags(tags);

      if (editMode && articleId) {
        const article = await getArticleBySlug(articleId);
        setOldArticle(article);
        const parser = new DOMParser();
        const dom = parser.parseFromString(article.content, "text/html");

        const tempEditor = createEditor({
          namespace: "temp-editor",
          nodes,
          onError: (error) => {
            throw error;
          },
        });

        tempEditor.update(() => {
          const nodesFromDom = $generateNodesFromDOM(tempEditor, dom);
          const root = $getRoot();
          root.clear();
          root.append(...nodesFromDom);

          const html = $generateHtmlFromNodes(tempEditor, null);
          setValue("content", html, { shouldValidate: true });

          const newEditorState = tempEditor.getEditorState();
          setInitialEditorState(newEditorState);
        });

        setValue("title", article.title);
        setValue("briefDescription", article.briefDescription);
        setValue("slug", article.slug);
        setValue("tags", article.tags);
        setSelectedTags(article.tags);
        setValue("isPublished", article.isPublished);
      }
    };

    loadFormData();
  }, [editMode, articleId, setValue]);

  useEffect(() => {
    const getAllTags = async (): Promise<void> => {
      const tags = await getTags();
      setAvailableTags(tags);
    };
    getAllTags();
  }, []);

  const handleRemoveSelectedTag = (value: string) => {
    const newSelectTags = selectedTags.filter((tag) => tag.name !== value);

    setSelectedTags([...newSelectTags]);
    setValue("tags", [...newSelectTags]);
    setCurrentValue("");
  };

  const handleAddTag = (value: string) => {
    const tag = availableTags.find((tag) => tag.name === value);
    if (!tag) return;
    const tagExists = selectedTags.includes(tag);

    if (tagExists) return;

    setSelectedTags([...selectedTags, tag]);
    setValue("tags", [...selectedTags, tag]);
    setCurrentValue("");
  };

  const debouncedSetContent = useMemo(
    () =>
      debounce((html: string) => {
        setValue("content", html, { shouldValidate: true });
      }, 500),
    [setValue]
  );

  async function componentOnSubmit(data: FormData) {
    try {
      if (editMode) {
        console.log("data", data);
        await updateArticle(oldArticle!._id, data);
      } else {
        const file = data.articleImageSrc?.item(0);

        if (!file) {
          console.error("There's something wrong with article file");
          return;
        }

        await saveArticle(data);
        await updateArticleAvatar(file, data.slug);
      }

      setModalMessage(
        editMode
          ? "Article updated successfully!"
          : "Article created successfully!"
      );
      setModalSuccess(true);
      reset();
    } catch (error) {
      if (error instanceof Error) {
        setModalMessage(
          editMode
            ? "An error occurred while updating the article."
            : "An error occurred while creating the article."
        );
        setModalSuccess(false);
      } else {
        setModalMessage(
          editMode
            ? "An error occurred while updating the article."
            : "An error occurred while creating the article."
        );
        setModalSuccess(false);
        setModalOpen(true);
      }
    } finally {
      setModalOpen(true);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit(componentOnSubmit)}>
        {editMode && (
          <div className="flex items-center space-x-2 py-5">
            <Switch
              id="publish-article"
              className="cursor-pointer"
              checked={isPublished}
              onCheckedChange={(checked) => {
                setValue("isPublished", checked, { shouldValidate: true });
              }}
            />
            <Label htmlFor="publish-article">Article Published</Label>
          </div>
        )}
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

        {!editMode && (
          <>
            <input
              type="file"
              className="w-full p-3 mb-4 rounded border border-neutral-700"
              {...register("articleImageSrc")}
            />
            {errors.articleImageSrc && (
              <p className="text-red-600">{errors.articleImageSrc.message}</p>
            )}
          </>
        )}

        <div className="mt-6 flex">
          <Editor
            initialHTML={editMode ? getValues("content") : ""}
            editorState={initialEditorState}
            onChange={(html) => debouncedSetContent(html)}
          />
          {errors.content && (
            <p className="text-red-600">{errors.content.message}</p>
          )}
        </div>

        <div className="flex items-center gap-10 mt-10">
          <select
            value={currentValue}
            className="border flex-1 px-3 py-2 rounded"
            onChange={(e) => handleAddTag(e.target.value)}
          >
            <option value="">Choose a tag</option>
            {availableTags.map((tag) => (
              <option key={tag.name} value={tag.name}>
                {tag.name}
              </option>
            ))}
          </select>

          <div className="flex flex-3 flex-col gap-2 rounded-[10] bg-white min-h-16 justify-center items-center">
            {selectedTags.length === 0 ? (
              <p className="text-center m-auto">{"There's no chosen tags"}</p>
            ) : (
              selectedTags.map((tag, idx) => (
                <div
                  key={idx}
                  className="flex font-semibold my-auto w-1/2 justify-between  items-center p-2"
                >
                  <span>{tag.name}</span>
                  <span
                    style={{ backgroundColor: tag.color }}
                    className="w-[80] h-[8] rounded-full"
                  />
                  <span
                    className=" rounded-[5] bg-red-500 cursor-pointer"
                    onClick={() => handleRemoveSelectedTag(tag.name)}
                  >
                    <X width={25} height={25} className="text-white" />
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        <button
          className="mt-6 cursor-pointer bg-secondary text-white px-6 py-2 rounded font-semibold hover:opacity-90"
          type="submit"
        >
          Save
        </button>
      </form>
      <ResultModalComponent
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        isSuccess={modalSuccess}
        message={modalMessage}
      />
    </>
  );
}
