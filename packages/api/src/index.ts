import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SaveRequestType } from "type/src/api/request/save-post";
import { safe_any_for_runtime_validation } from "type/src/util/any";

admin.initializeApp(functions.config().firebase);

export { saveTil } from "./routes/save-til";
export { getAllPosts } from "./routes/get-all-posts";
export { getAllShowablePosts } from "./routes/get-all-showable-posts";
export { getPostById } from "./routes/get-post-by-id";
export { getPostByIdForEdit } from "./routes/get-post-by-id-for-edit";
export { getAllPpostIds } from "./routes/get-all-post-ids";
export { editPost } from "./routes/edit-post";
export { deletePostById } from "./routes/delete-post-by-id";
export { updateShowFlg } from "./routes/update-show";
export { checkAdminOrNot } from "./routes/check-admin";

export const isValidRequestId = (
  data: safe_any_for_runtime_validation
): data is string => {
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

export const _isValidSaveRequestBody = (
  body: safe_any_for_runtime_validation
): body is SaveRequestType => {
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
