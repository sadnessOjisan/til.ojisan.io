export type PostResponse = {
  id: string;
  title: string;
  content: string;
  timeStamp: string;
  tags: string[];
  show: boolean;
};

export type PostsResponse = PostResponse[];

export type ShowablePostResponse = {
  id: string;
  title: string;
  content: string;
  timeStamp: string;
  tags: string[];
  show: true;
};

export type ShowablePostsResponse = ShowablePostResponse[];

export type GetPostByIdResponse = {
  id: string;
  title: string;
  content: string;
  timeStamp: string;
  tags: string[];
  show: boolean;
};

export type GetPostsByIdResponse = GetPostByIdResponse[];

export type PostIdsResponse = string[];

export type PostForEditResponse = {
  id: string;
  title: string;
  content: string;
  timeStamp: string;
  tags: string[];
};
