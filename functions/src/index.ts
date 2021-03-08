import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import { SaveRequestType } from "./types/request/SaveRequest";

admin.initializeApp(functions.config().firebase);

export { saveTil } from "./routes/saveTil";
export { getAllPosts } from "./routes/getAllPosts";
export { getPostById } from "./routes/getPostById";
export { getPostByIdForEdit } from "./routes/getPostByIdForEdit";
export { getAllPpostIds } from "./routes/getAllPostIds";
export { editPost } from "./routes/editPost";
export { deletePostById } from "./routes/deletePostById";

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
