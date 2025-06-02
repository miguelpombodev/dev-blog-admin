"use server";

import FetchApiClient from "@/lib/fetchClient";
import { createTagSchemaFormData } from "@/schemas/tag.schema";

export async function createTag(formData: createTagSchemaFormData) {
  const fetch = new FetchApiClient();
  const json = JSON.stringify(formData);

  const response = await fetch.Post<string>("devblog", "tags", {
    body: json,
  });

  return response;
}

export async function deleteTag(title: string) {
  const fetch = new FetchApiClient();

  const response = await fetch.Delete<string>(
    "devblog",
    `tags/${title.trim()}`
  );

  return response;
}

export async function updateTag(formData: createTagSchemaFormData) {
  const fetch = new FetchApiClient();
  const json = JSON.stringify(formData);

  const response = await fetch.Put<string>("devblog", "tags", {
    body: json,
  });

  return response;
}
