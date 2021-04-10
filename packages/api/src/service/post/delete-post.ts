import * as functions from "firebase-functions";
import { deletePostById } from "../../repository/post/delete-post-by-id";

export const deletePost = async (id: string) => {
  try {
    await deletePostById(id);
  } catch (e) {
    functions.logger.error(`<deletePost> ${id} の削除に失敗しました`, {
      structuredData: true,
    });
  }
};
