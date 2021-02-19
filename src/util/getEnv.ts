import { ENVS } from "../const/env";

export const getNodeEnv = () => {
  const env = process.env.NODE_ENV;
  if (env === "test") throw new Error("invalid env");
  if (!ENVS.includes(env)) throw new Error("invalid env");
  return env;
};
