import React from "react";
import { create } from "zustand";
import { combine } from "zustand/middleware";
import { Modal } from "@/ui/modal";
import { Button } from "@spek/ui";

interface Props {}

type Fn = () => void;

const useConfirmModalStore = create(
  combine({ message: "", onConfirm: undefined as undefined | Fn }, (set) => ({
    close: () => set({ message: "", onConfirm: undefined }),
    set,
  }))
);

export const confirmModal = (message: string, onConfirm: Fn) => {
  useConfirmModalStore.getState().set({ onConfirm, message });
};

export const ConfirmModal: React.FC<Props> = () => {
  const { message, onConfirm, close } = useConfirmModalStore();

  return (
    <Modal isOpen={!!onConfirm} onRequestClose={() => close()}>
      <div className="flex flex-col">
        <div className="flex">{message}</div>
        <div className="flex gap-2 mt-3">
          <Button
            type="button"
            color="primary"
            onClick={() => {
              close();
              onConfirm?.();
            }}
          >
            Yes
          </Button>
          <Button type="button" color="secondary" onClick={close}>
            No
          </Button>
        </div>
      </div>
    </Modal>
  );
};
