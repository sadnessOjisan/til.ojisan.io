import { safe_any_for_runtime_validation } from "type/src/util/any";

export type TagFireStoreFieldType = {
  name: string;
  timeStamp: FirebaseFirestore.FieldValue;
};

export type TagFireStoreFieldResponseType = {
  name: string;
  timeStamp: FirebaseFirestore.Timestamp;
};

export const isValidTagFireStoreFieldType = (
  data: safe_any_for_runtime_validation
): data is TagFireStoreFieldResponseType => {
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
