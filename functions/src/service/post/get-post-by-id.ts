import * as sanitizeHtml from "sanitize-html";
import * as marked from "marked";
import {
  getPostById,
  getPostFieldById,
} from "../../repository/post/get-post-by-id";
import { getTagsByRefs } from "../../repository/tag/get-tag-by-ref";
import { Post } from "../../domain/post";

export const getPostByPid = async (pid: string) => {
  const post = await getPostById(pid);
  const html = marked(post.content);
  const cleanHtml = sanitizeHtml(html);
  const sanitizedPost = {
    ...post,
    content: cleanHtml,
    timeStamp: post.timeStamp.toDate().toISOString(),
    show: post.show || false,
  };
  return sanitizedPost;
};

export const getPostModelByIdForEdit = async (pid: string) => {
  const post = await getPostFieldById(pid);
  const postTagRefs = post.tagRefs;
  const tags = await getTagsByRefs(postTagRefs);
  const postModel = Post.createPost({
    ...post,
    tags,
    timeStamp: post.timeStamp.toDate(),
  });
  return postModel;
};
