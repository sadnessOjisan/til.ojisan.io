import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../const/FirestoreCollectionKey";
import { TagFireStoreFieldType } from "../types/firestore/tag";
import { PostFireStoreFieldType } from "../types/firestore/post";
import { EditRequest } from "../types/request/EditRequest";
import { checkAdmin } from "../service/session/checkAdmin";

// データベースの参照を作成
const db = admin.firestore();

export const editPost = functions
  .region("asia-northeast1") // TODO: 関数の先頭は共通化できそう
  .https.onRequest(async (request, response) => {
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
    if (!_isValidEditRequestBody(parsedBody)) {
      console.error(`${JSON.stringify(request.body)} is invalid request`);
      response.status(400).json({ error: "invalid request" });
      return;
    }

    const createdTagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[] = [];
    let promises: Promise<void>[];
    // tag の保存
    if (parsedBody.tags !== undefined) {
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
        const postBody: Partial<PostFireStoreFieldType> = {
          title: parsedBody.title,
          content: parsedBody.content,
          timeStamp: admin.firestore.FieldValue.serverTimestamp(),
          tagRefs: createdTagRefs,
        };

        // post の保存
        try {
          await db
            .collection(COLLECTION_KEY.POSTS)
            .doc(parsedBody.id)
            .update(postBody);
          response.status(200).json("success");
        } catch (e) {
          console.error(e);
          response.status(500).json({ error: "fail to save post" });
        }
      });
    } else {
      // tag の保存は不要
      const postBody: Partial<PostFireStoreFieldType> = {
        title: parsedBody.title,
        content: parsedBody.content,
        timeStamp: admin.firestore.FieldValue.serverTimestamp(),
      };

      // post の保存
      try {
        db.collection(COLLECTION_KEY.POSTS)
          .doc(parsedBody.id)
          .update(postBody)
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
    }
  });

const _isValidEditRequestBody = (body: any): body is EditRequest => {
  if (
    body.title === undefined &&
    body.content === undefined &&
    body.tags === undefined
  ) {
    console.error("title, content, tags のどれか一つは必要");
    return false;
  }
  if (body.id === undefined) {
    console.error("id should be there");
    return false;
  }
  if (typeof body.id !== "string") {
    console.error("id should be string");
    return false;
  }
  if (typeof body.title !== "string") {
    console.error("title should be string");
    return false;
  }
  if (typeof body.content !== "string") {
    console.error("content should be string");
    return false;
  }
  if (!Array.isArray(body.tags)) {
    console.error("tags should be array string");
    return false;
  }
  for (let tag of body.tags) {
    if (typeof tag !== "string") {
      console.error("tag should be string");
      return false;
    }
  }
  return true;
};
