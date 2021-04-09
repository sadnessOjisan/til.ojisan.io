import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { isValidRequestId } from "..";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";
import { isValidPostFireStoreFiledType } from "../types/firestore/post";
import { isValidTagFireStoreFieldType } from "../types/firestore/tag";
import { GetPostByIdForEditResponseType } from "../types/response/GetPostByIdForEditResponse";
import { allowCors } from "../util/cors";

// データベースの参照を作成
const db = admin.firestore();

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
          const data = {
            id: doc.id,
            title: post.title,
            content: post.content,
            timeStamp: post.timeStamp.toDate().toISOString(),
            tags: names,
          };
          const responseContent: GetPostByIdForEditResponseType = data;
          response.status(200).json(responseContent);
        });
      });
  });
