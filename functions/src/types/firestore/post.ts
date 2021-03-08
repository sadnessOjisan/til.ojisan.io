export type PostFireStoreFieldType = {
  title: string;
  content: string; // markdown
  timeStamp: FirebaseFirestore.FieldValue;
  tagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[];
};

export type PostFireStoreFieldResponseType = {
  title: string;
  content: string; // markdown
  timeStamp: FirebaseFirestore.Timestamp;
  tagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[];
};

export const isValidPostFireStoreFiledType = (
  data: any
): data is PostFireStoreFieldResponseType => {
  console.info("data", data);
  if (data === undefined || data === null) {
    console.error("data should be there");
    return false;
  }
  if (typeof data.title !== "string") {
    console.error("should be string");
    return false;
  }
  if (typeof data.content !== "string") {
    console.error("should be string");
    return false;
  }
  if (data.timeStamp.toDate()) {
  }
  try {
    data.timeStamp.toDate();
  } catch (e) {
    console.error("should impl toDate()");
    return false;
  }
  if (!Array.isArray(data.tagRefs)) {
    console.error("should be string");
    return false;
  }
  return true;
};
