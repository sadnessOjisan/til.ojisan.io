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

export const checkAdmin = async (
  req: functions.https.Request
): Promise<boolean> => {
  const uid = await getAuthUserId(req);
  const ADMIN_USER_ID = process.env.ADMIN_USER_ID;
  if (!ADMIN_USER_ID) return false;
  return uid === process.env.ADMIN_USER_ID;
};
