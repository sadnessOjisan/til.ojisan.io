export const ENVS = ["production", "development"] as const;
export type ENV_TYPE = typeof ENVS[number];
