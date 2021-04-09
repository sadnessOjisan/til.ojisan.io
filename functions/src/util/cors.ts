import * as functions from "firebase-functions";

export const allowCors = (res: functions.Response) => {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, DELETE");
  res.set("Access-Control-Allow-Headers", "Content-Type, authorization");
};
