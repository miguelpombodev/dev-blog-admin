import { IArticle } from "../http/articles.interface";

export interface IArticleCardProps {
  article: IArticle;
  onDeleted?: () => void;
}
