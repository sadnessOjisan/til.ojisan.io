import { ENV_TYPE } from "../const/env";
import { CLOUDFUNCTIONS_ENDPOINT } from "../const/endpoint";
import { getNodeEnv } from "./getEnv";

export const getHostFromEnv = (env: ENV_TYPE) => {
  if (env === "development") {
    return CLOUDFUNCTIONS_ENDPOINT.DEV;
  } else if (env === "production") {
    return CLOUDFUNCTIONS_ENDPOINT.PRD;
  }
};

export const getHost = () => {
  return getHostFromEnv(getNodeEnv());
};
