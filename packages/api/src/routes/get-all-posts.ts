import * as functions from "firebase-functions";
import { allowCors } from "../util/cors";
import { getAllPostsInNewOrder } from "../service/post/get-all-posts-in-new-order";
import { getPostAndTagName } from "../usecase/post/get-post-and-tag-name";
import { PostsResponse } from "type/src/api/response/post-response";

/**
 * show flg が true の投稿を全件返す
 */
export const getAllPosts = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    allowCors(response); // 必要か調べる
    let posts;
    try {
      posts = await getAllPostsInNewOrder();
    } catch (e) {
      response.status(500).json("fail fetch");
      return;
    }

    const data = posts
      .map((post) => getPostAndTagName(post))
      .filter((post) => post.show)
      .map((post) => ({ ...post, show: true } as const)); // true の型をつけるため
    const responseContent: PostsResponse = data;
    response.status(200).json(responseContent);
  });
