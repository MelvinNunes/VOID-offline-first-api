export type ImageDTO = {
  url: string;
};

export type PostDTO = {
  id: string;
  title?: string;
  content?: string;
  category: number;
  images?: ImageDTO[];
};

export type PostUpdateDTO = {
  title?: string;
  content?: string;
  category: number;
};

export type PostCreateOrUpdate = {
  postId: string;
  userId: string;
  content?: string;
  title?: string;
  category?: number;
};
