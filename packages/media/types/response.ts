import {
  ShowablePostResponse,
  ShowablePostsResponse,
  PostIdsResponse,
} from "type/src/api/response/post-response";

export const isValidPostResponse = (
  data: any
): data is ShowablePostResponse => {
  if (data === undefined || data === null) {
    console.error("data should be there");
    return false;
  }
  if (typeof data.id !== "string") {
    console.error("data.id should be string");
    return false;
  }
  if (typeof data.title !== "string") {
    console.error("data.title should be string");
    return false;
  }
  if (typeof data.content !== "string") {
    console.error("data.content should be string");
    return false;
  }
  if (typeof data.timeStamp !== "string") {
    console.error("data.timeStamp should be string");
    return false;
  }
  if (data.show !== true) {
    console.error("data.show should be true");
    return false;
  }
  if (!Array.isArray(data.tags)) {
    console.error("data.tags should be array");
    return false;
  }
  for (let tag of data.tags) {
    if (typeof tag !== "string") {
      console.error("tag should be string");
      return false;
    }
  }
  return true;
};

export const isValidPostsResponse = (
  posts: any
): posts is ShowablePostsResponse => {
  if (!Array.isArray(posts)) {
    console.error("posts should be array");
    return false;
  }
  for (let post of posts) {
    if (!isValidPostResponse(post)) {
      console.error("post should be Post");
      return false;
    }
  }
  return true;
};

export const isValidPostIdsResponse = (
  paths: any
): paths is PostIdsResponse => {
  if (!Array.isArray(paths)) {
    console.error("posts should be array");
    return false;
  }
  for (let path of paths) {
    if (typeof path !== "string") {
      console.error("post should be Post");
      return false;
    }
  }
  return true;
};
