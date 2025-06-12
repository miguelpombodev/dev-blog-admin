export interface ITag {
  name: string;
  color: string;
}

export interface IArticle {
  _id: string;
  articleImageSrc: string;
  title: string;
  briefDescription: string;
  slug: string;
  content: string;
  tags: ITag[];
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
