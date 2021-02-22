import { ENVS, ENV_TYPE } from "../const/env";

export const getBuildNodeEnv = () => {
  const env = process.env.BUILD_ENV;
  if (env === "test") throw new Error("invalid env");
  if (!isValidEnv(env)) throw new Error("invalid env");
  return env;
};

export const isValidEnv = (env: any): env is ENV_TYPE => {
  if (!ENVS.includes(env)) return false;
  return true;
};
