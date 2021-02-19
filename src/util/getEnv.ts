import { ENVS, ENV_TYPE } from "../const/env";

export const getNodeEnv = () => {
  const env = process.env.NEXT_PUBLIC_BUILD_ENV;
  if (env === "test") throw new Error("invalid env");
  if (!isValidEnv(env)) throw new Error("invalid env");
  return env;
};

export const isValidEnv = (env: any): env is ENV_TYPE => {
  if (!ENVS.includes(env)) return false;
  return true;
};
