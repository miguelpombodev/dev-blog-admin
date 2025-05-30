import { ITag } from "@/interfaces/http/articles.interface";
import { EditorState } from "lexical";
import { z } from "zod";

export const baseCreateArticleSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  briefDescription: z
    .string()
    .min(3, "Brief Description mus have at least 3 characters"),
  slug: z.string().min(3, "Slug must have at least 3 characters").toLowerCase(),

  content: z
    .custom<EditorState>()
    .refine((val) => JSON.stringify(val).length > 10, {
      message: "Content must have at least 10 characters",
    }),
  tags: z
    .array(z.custom<ITag>())
    .min(1, "Tags list must have at least 1 tag written"),
});

export const createArticleSchema = baseCreateArticleSchema.extend({
  articleImageSrc: z
    .instanceof(FileList, { message: "Required file" })
    // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
    .refine((file) => file.item(0)?.size! > 0, { message: "File is required" }),
});

export const createArticleSchemaForApi = baseCreateArticleSchema.extend({
  articleImage: z.instanceof(File, { message: "Required file" }),
});
