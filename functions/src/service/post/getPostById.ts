import * as sanitizeHtml from "sanitize-html";
import * as marked from "marked";
import { getPostById } from "../../repository/post/getPostById";
import type { Post } from "../../types/model/Post";

export const getPostByPid = async (pid: string) => {
  const post = await getPostById(pid);
  const html = marked(post.content);
  const cleanHtml = sanitizeHtml(html);
  const sanitizedPost: Post = {
    ...post,
    content: cleanHtml,
    timeStamp: post.timeStamp.toDate().toISOString(),
    show: post.show || false,
  };
  return sanitizedPost;
};
