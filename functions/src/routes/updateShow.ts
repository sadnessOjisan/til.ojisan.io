import * as functions from "firebase-functions";
import { updateShow } from "../service/post/updateShowFlg";
import { checkAdmin } from "../service/session/checkAdmin";
import { isValidUpdateShowRequest } from "../types/request/update-show-request";

// update
export const updateShowFlg = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, POST, DELETE"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type, authorization");
    if (request.method === "OPTIONS") {
      response.status(204).send("");
    } else if (request.method === "POST") {
      const isAuthed = await checkAdmin(request);
      if (!isAuthed) {
        response.status(401).json({ error: "please login" });
        return;
      }
      const body = request.body;
      if (!isValidUpdateShowRequest(body)) {
        response.status(400).json({ error: "invalid request" });
        throw new Error("invalid requestrequest");
      }
      await updateShow(body.post_id, body.show);
      response.status(204).json("");
    } else {
      response.status(403).json("no method");
    }
  });
