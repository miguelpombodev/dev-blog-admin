import { ITag } from "@/interfaces/http/articles.interface";
import { z } from "zod";

export const baseCreateArticleSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  briefDescription: z
    .string()
    .min(3, "Brief Description mus have at least 3 characters"),
  slug: z.string().min(3, "Slug must have at least 3 characters").toLowerCase(),
  content: z.string().min(10, "Content must have at least 10 characters"),
  tags: z
    .array(z.custom<ITag>())
    .min(1, "Tags list must have at least 1 tag written"),
  isPublished: z.boolean().default(false).optional(),
});

export const createArticleSchema = baseCreateArticleSchema
  .extend({
    articleImageSrc: z
      .instanceof(FileList, { message: "Required file" })
      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
      .refine((file) => file.item(0)?.size! > 0, {
        message: "File is required",
      })
      .optional(),
    _editMode: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      !data._editMode &&
      (!data.articleImageSrc || data.articleImageSrc.length === 0)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Image is required",
        path: ["articleImageSrc"],
      });
    }
  });

export const createArticleSchemaForApi = baseCreateArticleSchema.extend({
  articleImage: z.instanceof(File, { message: "Required file" }),
});
