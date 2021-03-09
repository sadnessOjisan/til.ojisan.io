import * as functions from "firebase-functions";
import { updateShow } from "../service/post/updateShowFlg";
import { isValidUpdateShowRequest } from "../types/request/update-show-request";

//   tilを一つ取得
export const updateShowFlg = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, POST, DELETE"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type, authorization");
    const body = request.body;
    if (!isValidUpdateShowRequest(body)) {
      response.status(400).json({ error: "invalid requestrequest" });
      throw new Error("invalid requestrequest");
    }
    await updateShow(body.post_id, body.show);
    response.status(204).json("");
  });
