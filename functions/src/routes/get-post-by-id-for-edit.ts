import * as functions from "firebase-functions";
import { isValidRequestId } from "..";
import { GetPostByIdForEditResponseType } from "../types/response/get-post-by-id-for-edit-response";
import { allowCors } from "../util/cors";
import { getPostModelByIdForEdit } from "../service/post/get-post-by-id";
import { getPostAndTagName } from "../usecase/post/get-post-and-tag-name";

//   tilを一つedit用に取得(htmlに変換しない)
export const getPostByIdForEdit = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    allowCors(response); // 必要か調べる
    const id = request.query.id;
    if (!isValidRequestId(id)) {
      response.status(400).json({ error: "invalid requestrequest" });
      throw new Error("invalid requestrequest");
    }
    let post;
    try {
      post = await getPostModelByIdForEdit(id);
    } catch (e) {
      response.status(500).json("invalid req");
      return;
    }
    const data = getPostAndTagName(post);
    const responseContent: GetPostByIdForEditResponseType = data;
    response.status(200).json(responseContent);
  });
