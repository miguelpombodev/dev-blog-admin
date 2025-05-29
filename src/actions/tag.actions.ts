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
