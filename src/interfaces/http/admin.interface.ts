import { ITag } from "./articles.interface";

interface IInfoSquare {
  title: string;
  count: number;
}
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
  getArticlesAndTagsInformations: IInfoSquare[];
}

export interface IHealthCheck {
  status: string;
}
