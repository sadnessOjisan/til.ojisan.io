import * as functions from "firebase-functions";
import { checkAdmin } from "../service/session/checkAdmin";

// update
export const checkAdminOrNot = functions
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
      response.status(204).send("");
    }
  });
