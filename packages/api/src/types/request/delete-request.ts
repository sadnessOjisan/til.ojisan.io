import { DeleteRequest } from "type/src/api/request/delete-post";

export const isValidDeleteRequestBody = (body: any): body is DeleteRequest => {
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
