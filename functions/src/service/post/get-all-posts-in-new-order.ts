import { Post } from "../../domain/post";
import { getAllPostsInOrder } from "../../repository/post/get-all-posts-in-order";
import { getTagsByRefs } from "../../repository/tag/get-tag-by-ref";

export const getAllPostsInNewOrder = async () => {
  const posts = await getAllPostsInOrder("timeStamp", "desc");
  const postAndTag = posts.map(async (post) => {
    const postTagRefs = post.tagRefs;
    const tags = await getTagsByRefs(postTagRefs);
    const validPost = Post.createPost({
      ...post,
      tags: tags,
      timeStamp: post.timeStamp.toDate(),
      show: post.show ?? false,
    });
    return validPost;
  });
  const validPost = await Promise.all(postAndTag);
  return validPost;
};
