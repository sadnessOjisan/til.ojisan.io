import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { GetAllPostResponseType } from "../types/response/GetAllPostsResponseType";
import { allowCors } from "../util/cors";
import { getAllPostsInNewOrder } from "../service/post/get-all-posts-in-new-order";
import { getPostAndTagName } from "../usecase/post/get-post-and-tag-name";

//   tilを全て取得
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
    const data = posts.map((post) => getPostAndTagName(post));
    const responseContent: GetAllPostResponseType = data;
    response.status(200).json(responseContent);
  });
