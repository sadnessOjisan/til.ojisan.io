export type PostResponse = {
  id: string;
  title: string;
  content: string;
  timeStamp: string;
  tags: string[];
  show: true;
};

export type PostsResponse = PostResponse[];
