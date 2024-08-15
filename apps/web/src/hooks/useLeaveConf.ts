import { useCallback } from "react";
import { useTypeSafeMutation } from "./useTypeSafeMutation";
import { useCurrentConfIdStore } from "@/stores/useCurentConfIdStore";
import { closeVoiceConnections } from "@/webrtc/WebRTC";

export const useLeaveConf = () => {
  const { mutateAsync, isLoading } = useTypeSafeMutation("leaveConf");

  return {
    leaveConf: useCallback(() => {
      mutateAsync([useCurrentConfIdStore.getState().currentConfId!]);
      useCurrentConfIdStore.getState().setCurrentConfId(null);
      closeVoiceConnections(null);
    }, [mutateAsync]),
    isLoading,
  };
};
