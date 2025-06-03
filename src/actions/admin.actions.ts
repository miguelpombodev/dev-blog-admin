"use server";
import {
  IAdminArticlesInformations,
  IHealthCheck,
} from "@/interfaces/http/admin.interface";
import { IArticle } from "@/interfaces/http/articles.interface";
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

export async function getAllArticle() {
  const client = new FetchApiClient();
  const result = await client.Get<IArticle[]>(
    "devblog",
    "article?sort=desc",
    {}
  );

  return result;
}
