import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/FirestoreCollectionKey";

const db = admin.firestore();

export const getTagSnapshotByName = async (
  tagName: string
): Promise<
  | FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>
  | undefined
> => {
  const snapshot = await db
    .collection(COLLECTION_KEY.TAGS)
    .where("name", "==", tagName)
    .get();
  const ids = snapshot.docs.map((d) => d.ref);
  if (ids.length > 0) {
    return ids[0];
  } else {
    return undefined;
  }
};
