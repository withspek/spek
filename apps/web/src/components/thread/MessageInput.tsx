import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { useCallback, useMemo, useState } from "react";
import { showToast } from "@spek/ui";
import { classNames } from "@spek/lib";
import { Editable, Slate, withReact } from "slate-react";
import { withHistory } from "slate-history";
import { createEditor, Editor, Text, Transforms } from "slate";

import { useTypeSafeMutation } from "@/hooks/useTypeSafeMutation";
import { useConn } from "@/hooks/useConn";
import { serialize } from "@/utils/serialize";

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
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);
  const [lastMessageTimestamp, setLastMessageTimestamp] = useState<number>(0);
  const { mutateAsync } = useTypeSafeMutation("createThreadMessage");

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  const decorate = useCallback(([node, path]: any) => {
    const ranges: any = [];

    if (!Text.isText(node)) {
      return ranges;
    }

    const getLength = (token: any) => {
      if (typeof token === "string") {
        return token.length;
      } else if (typeof token.content === "string") {
        return token.content.length;
      } else {
        return token.content.reduce((l: any, t: any) => l + getLength(t), 0);
      }
    };

    const tokens = Prism.tokenize(node.text, Prism.languages.markdown);
    let start = 0;

    for (const token of tokens) {
      const length = getLength(token);
      const end = start + length;

      if (typeof token !== "string") {
        ranges.push({
          [token.type]: true,
          anchor: { path, offset: start },
          focus: { path, offset: end },
        });
      }

      start = end;
    }

    return ranges;
  }, []);

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
    Transforms.delete(editor, {
      at: {
        anchor: Editor.start(editor, []),
        focus: Editor.end(editor, []),
      },
    });
    setLastMessageTimestamp(Date.now());
  };

  return (
    <div className="bottom-0 z-30 sticky bg-primary-950 py-2">
      <Slate
        editor={editor}
        initialValue={value}
        onChange={(value) => setValue(value)}
      >
        <Editable
          onKeyDown={handleKeyDown}
          decorate={decorate}
          renderLeaf={renderLeaf}
          placeholder="Send message"
          className="bg-primary-900 py-2 px-4 focus:outline-none rounded-md"
        />
      </Slate>
    </div>
  );
};

const Leaf = ({ attributes, children, leaf }: any) => {
  return (
    <span
      {...attributes}
      className={classNames(
        leaf.bold && "font-bold",
        leaf.italic && "italic",
        leaf.underlined && "underline",
        leaf.code && "font-mono bg-primary-700 p-1"
      )}
    >
      {children}
    </span>
  );
};
