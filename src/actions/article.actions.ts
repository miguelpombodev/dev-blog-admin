"use server";
import { IArticle, ITag } from "@/interfaces/http/articles.interface";
import FetchApiClient from "@/lib/fetchClient";

export async function getTags(): Promise<ITag[]> {
  const client = new FetchApiClient();

  const result = await client.Get<ITag[]>("devblog", "tags");

  return result;
}

export async function getArticleBySlug(slug: string) {
  const client = new FetchApiClient();
  const result = await client.Get<IArticle>("devblog", `article/${slug}`, {});

  return result;
}
