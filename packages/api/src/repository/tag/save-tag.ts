import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/firestore-collection-key";
import { TagFireStoreFieldType } from "../../types/firestore/tag";

const db = admin.firestore();

export const saveTag = async (tagName: string) => {
  const tagData: TagFireStoreFieldType = {
    name: tagName,
    timeStamp: admin.firestore.FieldValue.serverTimestamp(),
  };
  const createdTagRef = await db.collection(COLLECTION_KEY.TAGS).add(tagData);
  return createdTagRef;
};
