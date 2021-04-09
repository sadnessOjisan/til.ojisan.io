import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";
import * as sanitizeHtml from "sanitize-html";
import * as marked from "marked";
import { isValidPostFireStoreFiledType } from "../types/firestore/post";
import { isValidTagFireStoreFieldType } from "../types/firestore/tag";
import { GetAllPostResponseType } from "../types/response/GetAllPostsResponseType";
import { allowCors } from "../util/cors";

// データベースの参照を作成
const db = admin.firestore();

//   tilを全て取得
export const getAllPosts = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    allowCors(response); // 必要か調べる

    await db
      .collection(COLLECTION_KEY.POSTS)
      .orderBy("timeStamp", "desc")
      .get()
      .then((snapshot) => {
        const docs = snapshot.docs;
        const promises = docs.map((doc) => {
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
          const innerPromises = Promise.all(tagNames).then((tagNames) => {
            const html = marked(post.content);
            const cleanHtml = sanitizeHtml(html);
            return {
              id: doc.id,
              title: post.title,
              content: cleanHtml,
              timeStamp: post.timeStamp.toDate().toISOString(),
              tags: tagNames,
              show: post.show || false,
            };
          });
          return innerPromises;
        });
        Promise.all(promises).then((data) => {
          const responseContent: GetAllPostResponseType = data;
          response.status(200).json(responseContent);
        });
      });
  });
