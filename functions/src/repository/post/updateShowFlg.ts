import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/FirestoreCollectionKey";
import { UpdatePostFireStoreFieldType } from "../../types/firestore/post";

const db = admin.firestore();

export const updateShowFlg = async (pid: string, nextShowState: boolean) => {
  const field: UpdatePostFireStoreFieldType = { show: nextShowState };
  await db.collection(COLLECTION_KEY.POSTS).doc(pid).update(field);
};
