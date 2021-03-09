import { updateShowFlg } from "../../repository/post/updateShowFlg";

export const updateShow = async (pid: string, nextShowState: boolean) => {
  await updateShowFlg(pid, nextShowState);
};
