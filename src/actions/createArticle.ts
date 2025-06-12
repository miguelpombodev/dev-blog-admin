"use server";

import FetchApiClient from "@/lib/fetchClient";
import { createArticleSchema } from "@/schemas/article.schema";
import { TrimObjectValues } from "@/utils/string.util";
import { z } from "zod";

type CreateArticleFormData = z.infer<typeof createArticleSchema>;

function buildFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("file", file);

  return formData;
}

export async function saveArticle(
  data: CreateArticleFormData
): Promise<string> {
  const { briefDescription, content, slug, tags, title } = data;
  const fetch = new FetchApiClient();
  const json = JSON.stringify(
    TrimObjectValues({ briefDescription, content, slug, tags, title })
  );

  const result = await fetch.Post<string>("devblog", "article", {
    body: json,
  });

  return result;
}

export async function updateArticle(id: string, data: CreateArticleFormData) {
  const fetch = new FetchApiClient();
  const json = JSON.stringify(TrimObjectValues(data));

  const result = await fetch.Put<string>("devblog", `article/${id}`, {
    body: json,
  });

  return result;
}

export async function updateArticleAvatar(file: File, slug: string) {
  const fetch = new FetchApiClient();

  const result = await fetch.Put<string>("devblog", `article/avatar/${slug}`, {
    body: buildFormData(file),
  });

  return result;
}
