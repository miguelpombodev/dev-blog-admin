"use server";

import FetchApiClient from "@/lib/fetchClient";
import { createArticleSchemaForApi } from "@/schemas/article.schema";
import { z } from "zod";

type FormData = z.infer<typeof createArticleSchemaForApi>;

export async function createArticle(data: FormData): Promise<string> {
  const fetch = new FetchApiClient();
  const json = JSON.stringify(data);

  const response = await fetch.Post<string>("devblog", "admin/create", {
    body: json,
  });

  return response;
}
