import { ConfPermissions } from "@spek/client";

export const mergeConfPermissions = (
  currentConfPermissions: ConfPermissions | null | undefined,
  newConfPermissions: Partial<ConfPermissions>
) => {
  return {
    ...(currentConfPermissions || {
      asked_to_speak: false,
      is_mod: false,
      is_speaker: false,
    }),
    ...newConfPermissions,
  };
};
