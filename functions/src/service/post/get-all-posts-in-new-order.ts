import { getAllPostsInOrder } from "../../repository/post/get-all-posts-in-order";
import { getTagsByRefs } from "../../repository/tag/get-tag-by-ref";

type Posts = Map<string, Post>;

export const getAllPostsInNewOrder = async () => {
  const postAndTags = new Map();
  const posts = await getAllPostsInOrder("timeStamp", "desc");
  posts.forEach(async (post) => {
    const postTagRefs = post.tagRefs;
    const tags = await getTagsByRefs(postTagRefs);
    postAndTags.set(post.id, {});
  });
  const allPostsTagRefs = posts.map((post) => post.tagRefs);
  const wrappedTags = allPostsTagRefs.map(async (postTagRefs) => {
    const tags = await getTagsByRefs(postTagRefs);
    return tags;
  });
  const tags = await Promise.all(wrappedTags);
};
