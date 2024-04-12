export type ImageDTO = {
  url: string;
};

export type PostDTO = {
  id: string;
  title?: string;
  content?: string;
  category: number;
  userId: string;
  images?: ImageDTO[];
};
