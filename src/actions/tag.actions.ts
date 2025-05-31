"use server";

import FetchApiClient from "@/lib/fetchClient";
import { createTagSchemaFormData } from "@/schemas/tag.schema";

export async function createTag(formData: createTagSchemaFormData) {
  const fetch = new FetchApiClient();
  const json = JSON.stringify(formData);

  const response = await fetch.Post<string>("devblog", "admin/create/tag", {
    body: json,
  });

  return response;
}

export async function deleteTag(title: string) {
  const fetch = new FetchApiClient();

  const response = await fetch.Delete<string>(
    "devblog",
    `admin/delete/tag/${title.trim()}`
  );

  return response;
}
