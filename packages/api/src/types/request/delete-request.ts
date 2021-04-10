import { DeleteRequest } from "type/src/api/request/delete-post";
import { safe_any_for_runtime_validation } from "type/src/util/any";

export const isValidDeleteRequestBody = (
  body: safe_any_for_runtime_validation
): body is DeleteRequest => {
  if (body === undefined || body === null) {
    console.error("body should be there");
    return false;
  }
  if (typeof body.id !== "string") {
    console.error("id should be there");
    return false;
  }
  return true;
};
