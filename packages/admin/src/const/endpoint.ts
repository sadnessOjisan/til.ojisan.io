export const CLOUDFUNCTIONS_ENDPOINT = {
  DEV: "https://asia-northeast1-til-ojisan-io-dev-ac456.cloudfunctions.net",
  PRD: "https://asia-northeast1-til-ojisan-io-a47a1.cloudfunctions.net",
};

export const API_PATHS = {
  getAllPosts: "getAllPosts",
  setShowFlg: "updateShowFlg",
  saveTil: "saveTil",
  getPostByIdForEdit: "getPostByIdForEdit",
  checkAdminOrNot: "checkAdminOrNot",
} as const;
