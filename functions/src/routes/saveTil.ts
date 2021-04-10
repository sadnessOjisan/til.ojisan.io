import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";
import { _isValidSaveRequestBody } from "..";
import { TagFireStoreFieldType } from "../types/firestore/tag";
import { PostFireStoreFieldType } from "../types/firestore/post";
import { checkAdmin } from "../service/session/checkAdmin";
import { allowCors } from "../util/cors";
import { parseBody } from "../util/parse-body";
import { savePost } from "../service/post/save-post";

// データベースの参照を作成
const db = admin.firestore();

/**
 * TILの保存
 */
export const saveTil = functions
  .region("asia-northeast1") // TODO: 関数の先頭は共通化できそう
  .https.onRequest(async (request, response) => {
    allowCors(response);
    if (request.method === "OPTIONS") {
      response.status(204).send("");
      return;
    }
    if (request.method !== "POST") {
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
    let parsedBody: any;
    try {
      parsedBody = parseBody(request.body);
    } catch (e) {
      response.status(400).json({ error: `${request.body} cannot parse` });
      return;
    }
    if (!_isValidSaveRequestBody(parsedBody)) {
      console.error(`${JSON.stringify(request.body)} is invalid request`);
      response.status(400).json({ error: "invalid request" });
      return;
    }

    try {
      savePost(
        {
          title: parsedBody.title,
          content: parsedBody.content,
        },
        parsedBody.tags
      );
    } catch (e) {
      response.status(200).json("fail save");
      return;
    }

    response.status(200).json("success");
  });
