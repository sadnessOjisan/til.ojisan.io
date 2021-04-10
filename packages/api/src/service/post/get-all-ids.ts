import { getAllPostIds } from "../../repository/post/get-all-post-ids";

export const getAllIds = async () => {
  return await getAllPostIds();
};
