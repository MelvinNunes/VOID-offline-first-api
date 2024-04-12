export type ImageDTO = {
  url: string;
};

export type PostDTO = {
  id: string;
  title?: string;
  content?: string;
  category: string;
  userId: string;
  images?: ImageDTO[];
};
