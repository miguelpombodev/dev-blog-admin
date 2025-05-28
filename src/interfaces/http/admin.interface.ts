import { ITag } from "./articles.interface";

interface IArticleTag extends ITag {
  id: string;
}

interface IArticlesCategoriesCount {
  tagId: IArticleTag;
  count: number;
}

interface IArticle {
  _id: string;
  articleImageSrc: string;
  title: string;
  briefDescription: string;
  slug: string;
  content: string;
  tags: IArticleTag[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface IAdminArticlesInformations {
  count: number;
  articles: IArticle[];
  articlesCategoriesCount: IArticlesCategoriesCount[];
}

export interface IHealthCheck {
  status: string;
}
