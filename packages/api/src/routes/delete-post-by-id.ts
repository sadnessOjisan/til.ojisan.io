import * as functions from "firebase-functions";
import { checkAdmin } from "../service/session/check-admin";
import { allowCors } from "../util/cors";
import { deletePost } from "../service/post/delete-post";
import { isValidDeleteRequestBody } from "../types/request/delete-request";
import { parseBody } from "../util/parse-body";

export const deletePostById = functions
  .region("asia-northeast1") // TODO: 関数の先頭は共通化できそう
  .https.onRequest(async (request, response) => {
    allowCors(response);
    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }
    if (request.method !== "DELETE") {
      response
        .status(400)
        .json({ error: `${request.method} is invalid method` });
      return;
    }
    const isAuthed = await checkAdmin(request);
    if (!isAuthed) {
      response.status(401).json({ error: "please login" });
      return;
    }
    let parsedBody;
    try {
      parsedBody = parseBody(request.body);
    } catch (e) {
      response.status(400).json({ error: `${request.body} cannot parse` });
      return;
    }

    if (!isValidDeleteRequestBody(parsedBody)) {
      response.status(400).json({ error: "invalid request" });
      return;
    }

    // post の削除
    try {
      await deletePost(parsedBody.id);
      response.status(200).json("success"); // TODO: should return 204
    } catch (e) {
      response.status(500).json({ error: "fail to save post" });
    }
  });
