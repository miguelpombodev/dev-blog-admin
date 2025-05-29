import { z } from "zod";

export const createTagSchema = z.object({
  title: z.string().min(3, "Title must have at least 3 characters"),
  color: z
    .string()
    .startsWith("#", "Color must be a hexadecimal color")
    .min(3, "Color must have at least 3 characters"),
});

export type createTagSchemaFormData = z.infer<typeof createTagSchema>;
