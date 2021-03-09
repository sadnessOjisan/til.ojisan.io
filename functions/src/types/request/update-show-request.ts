import * as functions from "firebase-functions";

export type UpdateShowRequestType = {
  post_id: string;
  show: boolean;
};

export const isValidUpdateShowRequest = (
  data: any
): data is UpdateShowRequestType => {
  if (data === null || data === undefined) {
    functions.logger.error(
      "<isValidUpdateShowRequest> data があるべき | data",
      data,
      {
        structuredData: true,
      }
    );
    return false;
  }
  if (typeof data.post_id === "string") {
    functions.logger.error(
      "<isValidUpdateShowRequest> post_id は文字列であるべき | data",
      data,
      {
        structuredData: true,
      }
    );
    return false;
  }
  if (typeof data.show === "boolean") {
    functions.logger.error(
      "<isValidUpdateShowRequest> show はbooleanであるべき | data",
      data,
      {
        structuredData: true,
      }
    );
    return false;
  }
  return true;
};
