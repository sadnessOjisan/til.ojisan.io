import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/firestore-collection-key";
import { isValidPostFireStoreFiledType } from "../../types/firestore/post";
import { isValidTagFireStoreFieldType } from "../../types/firestore/tag";

const db = admin.firestore();

/**
 * 指定したpostをtagと紐付け手取得する
 * @param pid post id
 * @returns post + tag
 */
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
    const data = {
      id: doc.id,
      title: postField.title,
      content: postField.content,
      timeStamp: postField.timeStamp,
      tags: names,
      show: postField.show,
    };
    return data;
  });
  return post;
};

export const getPostFieldById = async (pid: string) => {
  const doc = await db.collection(COLLECTION_KEY.POSTS).doc(pid).get();
  const postField = doc.data();
  if (!isValidPostFireStoreFiledType(postField)) {
    console.error(`${JSON.stringify(postField)} is invalid data.`);
    throw new Error("invalid data");
  }
  return { ...postField, id: doc.id };
};
