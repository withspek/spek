import { Dialog, DialogContent, DialogHeader } from "@spek/ui";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
}

export const EditThreadMessageModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader title={`Edit message`} />
        <div>
          <p>Cooming soon</p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
