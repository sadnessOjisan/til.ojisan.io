import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SaveRequestType } from "./types/request/save-request";

admin.initializeApp(functions.config().firebase);

export { saveTil } from "./routes/save-til";
export { getAllPosts } from "./routes/get-all-posts";
export { getPostById } from "./routes/get-post-by-id";
export { getPostByIdForEdit } from "./routes/get-post-by-id-for-edit";
export { getAllPpostIds } from "./routes/get-all-post-ids";
export { editPost } from "./routes/edit-post";
export { deletePostById } from "./routes/delete-post-by-id";
export { updateShowFlg } from "./routes/update-show";
export { checkAdminOrNot } from "./routes/check-admin";

export const isValidRequestId = (data: any): data is string => {
  if (data === undefined || data === null) {
    console.error("data should be there");
    return false;
  }
  if (typeof data !== "string") {
    console.error("data should be string");
    return false;
  }
  return true;
};

export const _isValidSaveRequestBody = (body: any): body is SaveRequestType => {
  if (!body) {
    console.error("should not empty");
    return false;
  }
  if (typeof body.title !== "string") {
    console.error("should be string");
    return false;
  }
  if (typeof body.content !== "string") {
    console.error("should be string");
    return false;
  }
  if (!Array.isArray(body.tags)) {
    console.error("should be array string");
    return false;
  }
  for (let tag of body.tags) {
    if (typeof tag !== "string") {
      console.error("tag should be string");
      return false;
    }
  }
  return true;
};
