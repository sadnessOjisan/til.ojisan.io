import * as functions from "firebase-functions";
import { isValidRequestId } from "..";
import { GetPostByIdResponse } from "../types/response/GetPostByIdResponse";
import { getPostByPid } from "../service/post/getPostById";

//   tilを一つ取得
export const getPostById = functions
  .region("asia-northeast1")
  .https.onRequest(async (request, response) => {
    response.set("Access-Control-Allow-Origin", "*");
    response.set(
      "Access-Control-Allow-Methods",
      "GET, HEAD, OPTIONS, POST, DELETE"
    );
    response.set("Access-Control-Allow-Headers", "Content-Type, authorization");
    const id = request.query.id;
    if (!isValidRequestId(id)) {
      response.status(400).json({ error: "invalid requestrequest" });
      throw new Error("invalid requestrequest");
    }

    const data = await getPostByPid(id);
    const responseContent: GetPostByIdResponse = data;
    response.status(200).json(responseContent);
  });
