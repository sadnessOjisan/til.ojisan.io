import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/firestore-collection-key";

const db = admin.firestore();

export const deletePostById = async (id: string) => {
  db.collection(COLLECTION_KEY.POSTS).doc(id).delete();
};
