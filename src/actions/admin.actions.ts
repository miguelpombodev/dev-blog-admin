"use server";
import {
  IAdminArticlesInformations,
  IHealthCheck,
} from "@/interfaces/http/admin.interface";
import FetchApiClient from "@/lib/fetchClient";

export async function getAdminInformations() {
  const client = new FetchApiClient();
  const result = await client.Get<IAdminArticlesInformations>(
    "devblog",
    "admin/articles"
  );

  return result;
}

export async function getHealthCheck() {
  const client = new FetchApiClient();
  const result = await client.Get<IHealthCheck>("devblog", "health/check");

  return result;
}
