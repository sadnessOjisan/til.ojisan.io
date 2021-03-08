export type TagFireStoreFieldType = {
  name: string;
  timeStamp: FirebaseFirestore.FieldValue;
};

export type TagFireStoreFieldResponseType = {
  name: string;
  timeStamp: FirebaseFirestore.Timestamp;
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
