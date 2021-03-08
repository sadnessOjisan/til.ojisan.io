import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { isValidRequestId } from "..";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";
import * as sanitizeHtml from "sanitize-html";
import * as marked from "marked";
import { isValidPostFireStoreFiledType } from "../types/firestore/post";
import { isValidTagFireStoreFieldType } from "../types/firestore/tag";
import { GetPostByIdResponse } from "../types/response/GetPostByIdResponse";

// データベースの参照を作成
const db = admin.firestore();

//   tilを一つ取得
export const getPostById = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, POST, DELETE"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type, authorization");
    const id = request.query.id;
    if (!isValidRequestId(id)) {
      response.status(400).json({ error: "invalid requestrequest" });
      throw new Error("invalid requestrequest");
    }
    await db
      .collection(COLLECTION_KEY.POSTS)
      .doc(id)
      .get()
      .then((doc) => {
        const post = doc.data();
        if (!isValidPostFireStoreFiledType(post)) {
          console.error(`${JSON.stringify(post)} is invalid data.`);
          response.status(500).json({ error: "internal database error" });
          throw new Error("invalid data");
        }
        const tagRefs = post.tagRefs;
        const tagNames = tagRefs.map(async (ref) => {
          const tagDoc = await ref.get();
          const tagData = tagDoc.data();
          if (!isValidTagFireStoreFieldType(tagData)) {
            console.error(`${JSON.stringify(tagData)} is invalid data.`);
            response.status(500).json({ error: "internal database error" });
            throw new Error("invalid tagData");
          }
          return tagData.name;
        });
        Promise.all(tagNames).then((names) => {
          const html = marked(post.content);
          const cleanHtml = sanitizeHtml(html);
          const data = {
            id: doc.id,
            title: post.title,
            content: cleanHtml,
            timeStamp: post.timeStamp.toDate().toISOString(),
            tags: names,
          };
          const responseContent: GetPostByIdResponse = data;
          response.status(200).json(responseContent);
        });
      });
  });
