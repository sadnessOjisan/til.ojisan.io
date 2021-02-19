import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SaveRequest } from "./types/request";
import { COLLECTION_KEY } from "./const/FirestoreCollectionKey";
import {
  isValidPostFireStoreFiledType,
  isValidTagFireStoreFieldType,
  PostFireStoreFieldType,
  TagFireStoreFieldType,
} from "./types/firestore";
import * as marked from "marked";
import * as sanitizeHtml from "sanitize-html";

admin.initializeApp(functions.config().firebase);

// データベースの参照を作成
const db = admin.firestore();

/**
 * TILの保存
 */
export const saveTil = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, POST, DELETE"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type, authorization");
    if (request.method !== "POST") {
      response
        .status(400)
        .json({ error: `${request.method} is invalid method` });
      return;
    }
    try {
      JSON.parse(request.body);
    } catch (e) {
      response.status(400).json({ error: `${request.body} cannot parse` });
      throw new Error("");
    }
    const parsedBody = JSON.parse(request.body);
    if (!_isValidSaveRequestBody(parsedBody)) {
      console.error(`${JSON.stringify(request.body)} is invalid request`);
      response.status(400).json({ error: "invalid request" });
      return;
    }

    const createdTagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[] = [];
    let promises: Promise<void>[];
    // tag の保存
    try {
      promises = parsedBody.tags.map(async (tag) => {
        // 既存 tag が無い時だけ作成する
        const tagName = tag;
        const snapshot = await db
          .collection(COLLECTION_KEY.TAGS)
          .where("name", "==", tagName)
          .get();
        if (snapshot.empty) {
          const tagData: TagFireStoreFieldType = {
            name: tag,
            timeStamp: admin.firestore.FieldValue.serverTimestamp(),
          };
          const createdTagRef = await db
            .collection(COLLECTION_KEY.TAGS)
            .add(tagData);
          const ref = createdTagRef;
          createdTagRefs.push(ref);
        } else {
          const ids = snapshot.docs.map((d) => d.ref);
          if (ids.length !== 1) {
            throw new Error("invalid data");
          }
          const id = ids[0];
          createdTagRefs.push(id);
        }
      });
    } catch (e) {
      console.error(e);
      response.status(500).json({ error: "fail to save tags" });
      return;
    }
    Promise.all(promises).then(async () => {
      const postBody: PostFireStoreFieldType = {
        title: parsedBody.title,
        content: parsedBody.content,
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
        tagRefs: createdTagRefs,
      };

      // post の保存
      try {
        await db.collection(COLLECTION_KEY.POSTS).add(postBody);
        response.status(200).json("success");
      } catch (e) {
        console.error(e);
        response.status(500).json({ error: "fail to save post" });
      }
    });
  });

//   tilを全て取得
export const getAllPosts = functions
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
            };
          });
          return innerPromises;
        });
        Promise.all(promises).then((data) => response.status(200).json(data));
      });
  });

export const _isValidSaveRequestBody = (body: any): body is SaveRequest => {
  if (!body) {
    console.error("should not empty");
    return false;
  }
  if (typeof body.title !== "string") {
    console.error("should be string");
    return false;
  }
  if (typeof body.content !== "string") {
    console.error("should be string");
    return false;
  }
  if (!Array.isArray(body.tags)) {
    console.error("should be array string");
    return false;
  }
  for (let tag of body.tags) {
    if (typeof tag !== "string") return false;
  }
  return true;
};
