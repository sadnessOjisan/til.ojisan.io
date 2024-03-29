import * as functions from "firebase-functions";
import { GetPostByIdResponse } from "type/src/api/response/post-response";
import { isValidRequestId } from "..";
import { getPostByPid } from "../service/post/get-post-by-id";
import { allowCors } from "../util/cors";

//   tilを一つ取得
export const getPostById = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    allowCors(response); // TODO: 必要か調べる
    const id = request.query.id;
    if (!isValidRequestId(id)) {
      response.status(400).json({ error: "invalid requestrequest" });
      throw new Error("invalid requestrequest");
    }

    const data = await getPostByPid(id);
    const responseContent: GetPostByIdResponse = data;
    response.status(200).json(responseContent);
  });
