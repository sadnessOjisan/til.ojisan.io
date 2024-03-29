import * as functions from "firebase-functions";
import { updateShow } from "../service/post/update-show-flg";
import { checkAdmin } from "../service/session/check-admin";
import { isValidUpdateShowRequest } from "../types/request/update-show-request";
import { allowCors } from "../util/cors";

// update
export const updateShowFlg = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    allowCors(response);
    if (request.method === "OPTIONS") {
      response.status(204).send("");
    } else if (request.method === "POST") {
      const isAuthed = await checkAdmin(request);
      if (!isAuthed) {
        response.status(401).json({ error: "please login" });
        return;
      }
      const body = JSON.parse(request.body);
      if (!isValidUpdateShowRequest(body)) {
        response
          .status(400)
          .json({ error: `${JSON.stringify(body)} is invalid request` });
        throw new Error("invalid requestrequest");
      }
      await updateShow(body.post_id, body.show);
      response.status(204).json("");
    } else {
      response.status(403).json("no method");
    }
  });
