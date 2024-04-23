import { Modal } from "@/ui/modal";

interface SettingsModalProps {
  open: boolean;
  onRequestClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onRequestClose,
  open,
}) => {
  return (
    <Modal isOpen={open} onRequestClose={onRequestClose}>
      <h2 className="text-center">Settings</h2>
    </Modal>
  );
};
