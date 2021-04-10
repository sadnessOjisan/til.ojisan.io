import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/firestore-collection-key";

const db = admin.firestore();

/**
 * posts の id を前言取得する
 * @returns idの配列
 */
export const getAllPostIds = async () => {
  const snapshot = await db.collection(COLLECTION_KEY.POSTS).get();
  const ids = snapshot.docs.map((doc) => doc.id);
  return ids;
};
