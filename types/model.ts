import { PostResponse } from "./response";

export type Post = {
  id: string;
  title: string;
  content: string;
  timeStamp: Date;
  tags: string[];
};

export const toPostFromResponse = (res: PostResponse): Post => {
  const date = new Date(res.timeStamp);
  if (date.toString() === "Invalid Date") throw new Error("invalid date");
  return {
    ...res,
    timeStamp: new Date(res.timeStamp),
  };
};
