import { updateShowFlg } from "../../repository/post/update-show-flg";

export const updateShow = async (pid: string, nextShowState: boolean) => {
  await updateShowFlg(pid, nextShowState);
};
