import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";
import { useTypeSafeQuery } from "./useTypeSafeQuery";

export const useCurrentConfFromCache = () => {
  const { currentConfId } = useCurrentConfIdStore();

  const { data } = useTypeSafeQuery(
    ["joinConfAndGetInfo", currentConfId!],
    { enabled: false },
    [currentConfId!]
  );

  return data;
};
