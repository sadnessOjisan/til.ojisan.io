import * as admin from "firebase-admin";
import * as sanitizeHtml from "sanitize-html";
import * as marked from "marked";
import { COLLECTION_KEY } from "../../const/FirestoreCollectionKey";
import { isValidPostFireStoreFiledType } from "../../types/firestore/post";
import { isValidTagFireStoreFieldType } from "../../types/firestore/tag";

const db = admin.firestore();

export const getPostById = async (pid: string) => {
  const doc = await db.collection(COLLECTION_KEY.POSTS).doc(pid).get();
  const postField = doc.data();
  if (!isValidPostFireStoreFiledType(postField)) {
    console.error(`${JSON.stringify(postField)} is invalid data.`);
    throw new Error("invalid data");
  }
  const tagNamePromise = postField.tagRefs.map(async (ref) => {
    const tagDoc = await ref.get();
    const tagData = tagDoc.data();
    if (!isValidTagFireStoreFieldType(tagData)) {
      console.error(`${JSON.stringify(tagData)} is invalid data.`);
      throw new Error("invalid tagData");
    }
    return tagData.name;
  });

  const post = Promise.all(tagNamePromise).then((names) => {
    const html = marked(postField.content);
    const cleanHtml = sanitizeHtml(html);
    const data = {
      id: doc.id,
      title: postField.title,
      content: cleanHtml,
      timeStamp: postField.timeStamp.toDate().toISOString(),
      tags: names,
    };
    return data;
  });
  return post;
};
