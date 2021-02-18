export type PostFireStoreFieldType = {
  title: string;
  content: string; // markdown
  timeStamp: FirebaseFirestore.FieldValue;
  tagRefs: FirebaseFirestore.DocumentReference<FirebaseFirestore.DocumentData>[];
};

export const isValidPostFireStoreFiledType = (
  data: any
): data is PostFireStoreFieldType => {
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

export type TagFireStoreFieldType = {
  name: string;
  timeStamp: FirebaseFirestore.FieldValue;
};

export const isValidTagFireStoreFieldType = (
  data: any
): data is TagFireStoreFieldType => {
  if (data === undefined || data === null) {
    console.error("data should be there");
    return false;
  }
  if (typeof data.name !== "string") {
    console.error("name should be string");
    return false;
  }
  try {
    data.timeStamp.toDate();
  } catch (e) {
    console.error("timeStamp should impl toDate()");
    return false;
  }
  return true;
};
