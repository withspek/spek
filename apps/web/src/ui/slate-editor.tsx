"use client";

import Prism from "prismjs";
import "prismjs/components/prism-markdown";
import { classNames } from "@spek/lib";
import { Dispatch, SetStateAction, useCallback, useMemo } from "react";
import { createEditor, Descendant, Editor, Text, Transforms } from "slate";
import { withHistory } from "slate-history";
import { Editable, Slate, withReact } from "slate-react";

interface SlateEditorProps {
  className?: string;
  placeholder?: string;
  value: Descendant[];
  setValue: Dispatch<SetStateAction<Descendant[]>>;
  onSubmit?: () => void;
  disableSubmit?: boolean;
}

export const SlateEditor: React.FC<SlateEditorProps> = ({
  onSubmit,
  setValue,
  value,
  className,
  placeholder,
  disableSubmit = false,
}) => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, []);

  useMemo(() => {
    Transforms.select(editor, { offset: 0, path: [0, 0] });
  }, [editor]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey && !disableSubmit) {
      event.preventDefault();
      onSubmit?.();

      Transforms.delete(editor, {
        at: {
          anchor: Editor.start(editor, []),
          focus: Editor.end(editor, []),
        },
      });
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

  return (
    <Slate
      editor={editor}
      initialValue={value}
      onChange={(value) => setValue(value)}
    >
      <Editable
        onKeyDown={handleKeyDown}
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder={placeholder}
        className={classNames(
          "bg-primary-900 py-2 px-4 focus:outline-none rounded-md",
          className,
        )}
      />
    </Slate>
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
        leaf.code && "font-mono bg-primary-700 p-1",
      )}
    >
      {children}
    </span>
  );
};
