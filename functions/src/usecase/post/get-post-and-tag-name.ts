import { Post } from "../../domain/Post";

export const getPostAndTagName = (post: Post) => {
  return {
    id: post.id,
    title: post.title,
    content: post.content,
    timeStamp: post.timeStamp.toISOString(),
    show: post.show,
    tags: post.tags.map((tag) => tag.name),
  };
};
