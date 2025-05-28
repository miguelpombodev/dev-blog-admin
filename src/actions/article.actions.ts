"use server";
import { ITag } from "@/interfaces/http/articles.interface";
import FetchApiClient from "@/lib/fetchClient";

export async function getTags(): Promise<ITag[]> {
  const client = new FetchApiClient();

  const result = await client.Get<ITag[]>("devblog", "admin/tags");

  return result;
}
