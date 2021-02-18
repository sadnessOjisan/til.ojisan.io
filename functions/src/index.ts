import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SaveRequest } from "./types/request";
import { COLLECTION_KEY } from "./const/FirestoreCollectionKey";

admin.initializeApp(functions.config().firebase);

// データベースの参照を作成
const fireStore = admin.firestore();

/**
 * TILの保存
 */
export const saveTil = functions.https.onRequest((request, response) => {
  if (request.method !== "post") {
    response.status(400).json({ error: `${request.method} is invalid method` });
    return;
  }
  if (!_isValidSaveRequestBody(request.body)) {
    console.error(`${JSON.stringify(request.body)} is invalid request`);
    response.status(400).json({ error: "invalid request" });
    return;
  }

  const body = request.body;
  fireStore
    .collection(COLLECTION_KEY.POSTS)
    .add(body)
    .catch((e) => {
      console.error(e);
      response.status(500).json({ error: "firebase error" });
      return;
    });
  response.status(200).json("success");
});

const _isValidSaveRequestBody = (req: any): req is SaveRequest => {
  if (!req) {
    console.error("should not empty");
    return false;
  }
  if (typeof req.content !== "string") {
    console.error("should be string");
    return false;
  }
  if (!Array.isArray(req.tags)) {
    console.error("should be array string");
    return false;
  }
  req.tags.forEach((tag: unknown) => {
    if (typeof tag !== "string") return false;
  });
  return true;
};
