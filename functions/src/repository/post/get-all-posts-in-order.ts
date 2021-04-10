import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/FirestoreCollectionKey";
import { isValidPostFireStoreFiledType } from "../../types/firestore/post";
import { Post } from "../../domain/Post";

const db = admin.firestore();

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
