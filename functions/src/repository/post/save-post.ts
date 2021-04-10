import * as admin from "firebase-admin";
import { COLLECTION_KEY } from "../../const/FirestoreCollectionKey";
import {
  PostFireStoreFieldType,
  UpdatePostFireStoreFieldType,
} from "../../types/firestore/post";

const db = admin.firestore();

type Post = {
  title: string;
  content: string;
  timeStamp: Date;
};

export const savePostAndTags = async (
  post: Post,
  tagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[]
) => {
  const postBody: PostFireStoreFieldType = {
    title: post.title,
    content: post.content,
    timeStamp: admin.firestore.FieldValue.serverTimestamp(),
    tagRefs: tagRefs,
  };
  await db.collection(COLLECTION_KEY.POSTS).add(postBody);
};
