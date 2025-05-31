import { ITag } from "../http/articles.interface";

export interface ITagCardProps {
  tag: ITag;
  onDeleted?: () => void;
}
