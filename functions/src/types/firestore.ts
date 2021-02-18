export type PostFireStoreFieldType = {
  title: string;
  content: string; // markdown
  timeStamp: FirebaseFirestore.FieldValue;
  tagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[];
};

export type TagFireStoreFieldType = {
  name: string;
  timeStamp: FirebaseFirestore.FieldValue;
};
