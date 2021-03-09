import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";

// データベースの参照を作成
const db = admin.firestore();

export const deletePostById = functions
  .region("asia-northeast1") // TODO: 関数の先頭は共通化できそう
  .https.onRequest((request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    if (request.method === "OPTIONS") {
      // Send response to OPTIONS requests
      response.set("Access-Control-Allow-Methods", "DELETE");
      response.set("Access-Control-Allow-Headers", "Content-Type");
      response.set("Access-Control-Max-Age", "3600");
      response.status(204).send("");
      return;
    }
    if (request.method !== "DELETE") {
      response
        .status(400)
        .json({ error: `${request.method} is invalid method` });
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

    // post の保存
    try {
      db.collection(COLLECTION_KEY.POSTS)
        .doc(parsedBody.id)
        .delete()
        .then(() => {
          response.status(200).json("success");
        })
        .catch(() => {
          console.error("fail to save edit data");
        });
    } catch (e) {
      console.error(e);
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