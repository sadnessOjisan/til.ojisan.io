import firebase from "firebase/app";
import "firebase/auth";
import { getNodeEnv } from "../util/getEnv";
import { assertError } from "../util/assert-error";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfigDev = {
  apiKey: "AIzaSyBwspFxdnpEQg3ni3VM8r1OKK7wFFin2Hk",
  authDomain: "til-ojisan-io-dev-ac456.firebaseapp.com",
  projectId: "til-ojisan-io-dev-ac456",
} as const;

const firebaseConfigPrd = {
  apiKey: "AIzaSyBxmSO7P_bNaIHZrFDXv-jfCwJshyj83To",
  authDomain: "til-ojisan-io-a47a1.firebaseapp.com",
  projectId: "til-ojisan-io-a47a1",
} as const;

const env = getNodeEnv();

switch (env) {
  case "development":
    firebase.initializeApp(firebaseConfigDev);
    break;
  case "production":
    firebase.initializeApp(firebaseConfigPrd);
    break;
  default:
    assertError(env);
    throw new Error(`${env} is invalid env`);
}

export const auth = firebase.auth();
export const GhProvider = new firebase.auth.GithubAuthProvider();
export default firebase;
