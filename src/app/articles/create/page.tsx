"use client";

import ArticleFormComponent from "@/app/components/ArticleForm";

export default function CreateArticlePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Create New Article</h1>

      <ArticleFormComponent />
    </div>
  );
}
