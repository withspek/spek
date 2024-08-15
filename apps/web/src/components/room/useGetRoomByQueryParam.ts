import { useTypeSafeQuery } from "@/hooks/useTypeSafeQuery";
import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";
import { JoinConfAndGetInfoResponse } from "@spek/client/dist/http/responses";
import { showToast } from "@spek/ui";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const useGetConfByQueryParam = (confId: string) => {
  const { setCurrentConfId } = useCurrentConfIdStore();
  const { data, isLoading } = useTypeSafeQuery(
    ["joinConfAndGetInfo", confId || ""],
    {
      refetchOnMount: "always",
      onSuccess: ((d: JoinConfAndGetInfoResponse) => {
        if (d && !("error" in d) && d.conf) {
          setCurrentConfId(() => d.conf.id);
        }
      }) as any,
    },
    [confId]
  );
  const { push } = useRouter();

  useEffect(() => {
    if (confId) {
      setCurrentConfId(confId);
    }
  }, [confId, setCurrentConfId]);

  const errMsg = data && "error" in data ? data.error : "";
  const noData = !data;

  useEffect(() => {
    if (isLoading) {
      return;
    }
    if (noData) {
      setCurrentConfId(null);
      console.log(errMsg, isLoading);
      showToast(errMsg, "error");
      push("/home");
    }
  }, [noData, errMsg, isLoading, push, setCurrentConfId]);

  return { data, isLoading };
};
