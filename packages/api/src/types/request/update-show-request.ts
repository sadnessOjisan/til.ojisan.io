import * as functions from "firebase-functions";
import { UpdateShowRequestType } from "type/src/api/request/update-post";
import { safe_any_for_runtime_validation } from "type/src/util/any";

export const isValidUpdateShowRequest = (
  data: safe_any_for_runtime_validation
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
  if (typeof data.post_id !== "string") {
    functions.logger.error(
      "<isValidUpdateShowRequest> post_id は文字列であるべき | data.post_id",
      data.post_id,
      {
        structuredData: true,
      }
    );

    return false;
  }
  if (typeof data.show !== "boolean") {
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
