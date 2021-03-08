import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";
import { GetAllPostIdsResponseType } from "../types/response/GetAllPostIdsResponse";

// データベースの参照を作成
const db = admin.firestore();

export const getAllPpostIds = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, POST, DELETE"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type, authorization");
    await db
      .collection(COLLECTION_KEY.POSTS)
      .get()
      .then((snapshot) => {
        const docs = snapshot.docs;
        const ids = docs.map((doc) => {
          return doc.id;
        });
        const resContent: GetAllPostIdsResponseType = ids;
        response.status(200).json(resContent);
      });
  });
