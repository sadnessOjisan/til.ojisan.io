import * as admin from "firebase-admin";
import * as functions from "firebase-functions";

export const getAuthUserId = async (
  req: functions.https.Request
): Promise<string> => {
  const match = req.headers.authorization?.match(/^Bearer (.*)$/);
  if (match === undefined || match === null) {
    functions.logger.error("auth token に bearer 足りない, match: ", match, {
      structuredData: true,
    });
    throw new Error("auth token に bearer 足りない");
  }
  const idToken = match[1];
  let decoded: admin.auth.DecodedIdToken;
  try {
    decoded = await admin.auth().verifyIdToken(idToken);
  } catch (e) {
    functions.logger.error("firebase auth error, idToken: ", idToken, {
      structuredData: true,
    });
    throw new Error(e);
  }

  return decoded.uid;
};

/**
 * 管理者からのアクセスかどうかチェックする
 * @param req
 * @returns 管理者かどうかの真偽値
 */
export const checkAdmin = async (
  req: functions.https.Request
): Promise<boolean> => {
  const uid = await getAuthUserId(req);
  const ADMIN_USER_ID = functions.config().admin.user_id;
  if (!ADMIN_USER_ID) {
    throw new Error("please set ADMIN_USER_ID");
  }
  return uid === ADMIN_USER_ID;
};
