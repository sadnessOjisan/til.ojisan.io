import * as functions from "firebase-functions";
import { checkAdmin } from "../service/session/check-admin";
import { allowCors } from "../util/cors";

// update
export const checkAdminOrNot = functions
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
      response.status(204).send("");
    }
  });
