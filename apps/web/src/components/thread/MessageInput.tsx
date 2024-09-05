import { useState } from "react";
import { showToast } from "@spek/ui";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useConn } from "@/hooks/useConn";
import { serialize } from "@/utils/serialize";
import { SlateEditor } from "@/ui/slate-editor";

interface MessageInputProps {
  threadId: string;
  communityId: string;
}

const initialValue = [{ type: "paragraph", children: [{ text: "" }] }];

export const MessageInput: React.FC<MessageInputProps> = ({
  threadId,
  communityId,
}) => {
  const { user } = useConn();
  const [value, setValue] = useState<any>(initialValue);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);
  const { mutateAsync } = useTypeSafeMutation("createThreadMessage");

  const handleSubmit = async () => {
    const text = serialize(value);

    if (Date.now() - lastMessageTimestamp <= 2000) {
      showToast("Wait 2 seconds before sending another message", "error");
      return;
    }

    const data = {
      text,
      threadId: threadId,
      communityId: communityId,
      userId: user.id,
    };

    await mutateAsync([data]);

    setLastMessageTimestamp(Date.now());
  };

  return (
    <div className="bottom-0 z-30 sticky bg-primary-950 py-2">
      <SlateEditor
        onSubmit={handleSubmit}
        setValue={setValue}
        value={value}
        placeholder="Send message"
      />
    </div>
  );
};
