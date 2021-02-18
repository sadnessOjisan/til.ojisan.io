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
export const saveTil = functions
  .region("asia-northeast1")
  .https.onRequest((request, response) => {
    if (request.method !== "POST") {
      response
        .status(400)
        .json({ error: `${request.method} is invalid method` });
      return;
    }
    if (!_isValidSaveRequestBody(request.body)) {
      console.error(`${JSON.stringify(request.body)} is invalid request`);
      response.status(400).json({ error: "invalid request" });
      return;
    }

    const body = request.body;

    const createdTagIds: string[] = [];
    let promises: Promise<void>[];
    // tag の保存
    try {
      promises = body.tags.map(async (tag) => {
        // 既存 tag が無い時だけ作成する
        const tagName = tag;
        const snapshot = await fireStore
          .collection("tags")
          .where("name", "==", tagName)
          .get();
        if (snapshot.empty) {
          const tagData = { name: tag };
          const createdTagRef = await fireStore
            .collection(COLLECTION_KEY.TAGS)
            .add(tagData);
          const id = createdTagRef.id;
          createdTagIds.push(id);
        } else {
          const ids = snapshot.docs.map((d) => d.id);
          if (ids.length !== 1) {
            throw new Error("invalid data");
          }
          const id = ids[0];
          createdTagIds.push(id);
        }
      });
    } catch (e) {
      console.error(e);
      response.status(500).json({ error: "fail to save tags" });
      return;
    }
    Promise.all(promises).then(async () => {
      const postBody = {
        content: body.content,
        tags: createdTagIds,
      };

      // post の保存
      try {
        await fireStore.collection(COLLECTION_KEY.POSTS).add(postBody);
        response.status(204).json("success");
      } catch (e) {
        console.error(e);
        response.status(500).json({ error: "fail to save post" });
      }
    });
  });

export const _isValidSaveRequestBody = (body: any): body is SaveRequest => {
  if (!body) {
    console.error("should not empty");
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
