"use server";

import FetchApiClient from "@/lib/fetchClient";
import { createArticleSchema } from "@/schemas/article.schema";
import { z } from "zod";

type CreateArticleFormData = z.infer<typeof createArticleSchema>;

function buildFormData(file: File): FormData {
  const formData = new FormData();
  formData.append("file", file);

  return formData;
}

export async function createArticle(
  data: CreateArticleFormData,
  file: File
): Promise<{ postResponse: string; putResponse: string }> {
  const { briefDescription, content, slug, tags, title } = data;
  const fetch = new FetchApiClient();
  const json = JSON.stringify({ briefDescription, content, slug, tags, title });

  const postResponse = await fetch.Post<string>("devblog", "article", {
    body: json,
  });

  const putResponse = await fetch.Put<string>(
    "devblog",
    `article/avatar/${slug}`,
    {
      body: buildFormData(file),
    }
  );

  return {
    postResponse,
    putResponse,
  };
}
