import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { EditRequest, SaveRequest } from "./types/request";
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
  .region("asia-northeast1") // TODO: 関数の先頭は共通化できそう
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
          response.status(200).json(data);
        });
      });
  });

//   tilを一つedit用に取得(htmlに変換しない)
export const getPostByIdForEdit = functions
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
          const data = {
            id: doc.id,
            title: post.title,
            content: post.content,
            timeStamp: post.timeStamp.toDate().toISOString(),
            tags: names,
          };
          response.status(200).json(data);
        });
      });
  });

export const isValidRequestId = (data: any): data is string => {
  if (data === undefined || data === null) {
    console.error("data should be there");
    return false;
  }
  if (typeof data !== "string") {
    console.error("data should be string");
    return false;
  }
  return true;
};

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
        response.status(200).json(ids);
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
    if (typeof tag !== "string") {
      console.error("tag should be string");
      return false;
    }
  }
  return true;
};

export const editPost = functions
  .region("asia-northeast1") // TODO: 関数の先頭は共通化できそう
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
