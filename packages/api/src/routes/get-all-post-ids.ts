import * as functions from "firebase-functions";
import { PostIdsResponse } from "type/src/api/response/post-response";
import { allowCors } from "../util/cors";
import { getAllIds } from "../service/post/get-all-ids";

export const getAllPpostIds = functions
  .region("asia-northeast1")
  .https.onRequest(async (_, response) => {
    allowCors(response); // TODO: 必要か調べる
    let ids: string[];
    try {
      ids = await getAllIds();
    } catch (e) {
      response.status(500).json("firebase error");
      return;
    }
    const resContent: PostIdsResponse = ids;
    response.status(200).json(resContent);
  });
