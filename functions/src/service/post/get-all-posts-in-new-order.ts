import { Post } from "../../domain/Post";
import { getAllPostsInOrder } from "../../repository/post/get-all-posts-in-order";
import { getTagsByRefs } from "../../repository/tag/get-tag-by-ref";

type Posts = Map<string, Post>;

export const getAllPostsInNewOrder = async () => {
  const postsMap: Posts = new Map();
  const posts = await getAllPostsInOrder("timeStamp", "desc");
  posts.forEach(async (post) => {
    const postTagRefs = post.tagRefs;
    const tags = await getTagsByRefs(postTagRefs);
    const validPost = Post.createPost({
      ...post,
      tags: tags,
      timeStamp: post.timeStamp.toDate(),
      show: post.show ?? false,
    });
    postsMap.set(post.id, validPost);
  });
  return postsMap;
};
