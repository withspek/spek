import React, { Dispatch, SetStateAction } from "react";
import { Modal } from "@/ui/modal";

interface EditProfileProps {
  isOpen: boolean;
  onRequestClose: () => void;
}

export const EditProfileModal: React.FC<EditProfileProps> = ({
  isOpen,
  onRequestClose,
}) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <p>Hello this modal allows you to edit your profile</p>
    </Modal>
  );
};
