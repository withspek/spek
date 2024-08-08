import { Confs } from "../ConfState";

export const deleteConf = (confId: string, confs: Confs) => {
  if (!(confId in confs)) {
    return;
  }

  delete confs[confId];
};
