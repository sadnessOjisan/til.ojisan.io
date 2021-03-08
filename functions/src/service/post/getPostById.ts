import * as sanitizeHtml from "sanitize-html";
import * as marked from "marked";
import { getPostById } from "../../repository/post/getPostById";

export const getPostByPid = async (pid: string) => {
  const post = await getPostById(pid);
  const html = marked(post.content);
  const cleanHtml = sanitizeHtml(html);
  const sanitizedPost = {
    ...post,
    content: cleanHtml,
  };
  return sanitizedPost;
};
