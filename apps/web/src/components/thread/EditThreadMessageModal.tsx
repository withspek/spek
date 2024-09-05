import { useState } from "react";
import { Message } from "@spek/client";
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@spek/ui";

import { SlateEditor } from "@/ui/slate-editor";
import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { serialize } from "@/utils/serialize";

interface Props {
  isOpen: boolean;
  onOpenChange: () => void;
  message: Message;
  threadId: string;
  currentCursor: number;
}

export const EditThreadMessageModal: React.FC<Props> = ({
  isOpen,
  onOpenChange,
  message,
  threadId,
  currentCursor,
}) => {
  const [value, setValue] = useState<any>([
    { type: "paragraph", children: [{ text: message.text }] },
  ]);
  const { mutateAsync, isLoading } = useTypeSafeMutation("updateThreadMessage");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader title={`Edit message`} />
        <div className="py-2">
          <SlateEditor
            disableSubmit={true}
            setValue={setValue}
            value={value}
            placeholder="New message content"
            className="bg-primary-800"
          />
        </div>
        <DialogFooter>
          <Button
            onClick={async () => {
              const text = serialize(value);
              await mutateAsync([
                {
                  threadId,
                  messageId: message.id,
                  text,
                  cursor: currentCursor,
                },
              ]);
              onOpenChange();
            }}
            loading={isLoading}
          >
            Save
          </Button>
          <Button onClick={onOpenChange}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
