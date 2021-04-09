import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { checkAdmin } from "../service/session/checkAdmin";
import { allowCors } from "../util/cors";
import { deletePost } from "../service/post/delete-post";

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
    try {
      JSON.parse(request.body);
    } catch (e) {
      response.status(400).json({ error: `${request.body} cannot parse` });
      throw new Error("body parse error");
    }
    const parsedBody = JSON.parse(request.body);
    if (!_isValidDeleteRequestBody(parsedBody)) {
      console.error(`${JSON.stringify(request.body)} is invalid request`);
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

const _isValidDeleteRequestBody = (body: any): body is { id: string } => {
  if (body === undefined || body === null) {
    console.error("body should be there");
    return false;
  }
  if (typeof body.id !== "string") {
    console.error("id should be there");
    return false;
  }
  return true;
};
