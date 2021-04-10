import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/firestore-collection-key";
import { isValidPostFireStoreFiledType } from "../../types/firestore/post";

const db = admin.firestore();

/**
 * 指定した順序で投稿を取得する
 * @param key 順序キー
 * @param order 降順・昇順を決める
 * @returns
 */
export const getAllPostsInOrder = async (
  key: string,
  order: FirebaseFirestore.OrderByDirection
) => {
  const snapshot = await db
    .collection(COLLECTION_KEY.POSTS)
    .orderBy(key, order)
    .get();

  const docs = snapshot.docs;
  return docs.map((doc) => {
    const post = doc.data();
    if (!isValidPostFireStoreFiledType(post)) {
      console.error(`${JSON.stringify(post)} is invalid data.`);
      throw new Error("invalid data");
    }
    const postJson = { id: doc.id, ...post };
    return postJson;
  });
};
