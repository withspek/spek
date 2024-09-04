import Markdor from "@withspek/markdor";
import Link from "next/link";

// Parser rules
var rules: any = {
  ...Markdor.defaultRules,
  paragraph: {
    ...Markdor.defaultRules.paragraph,
  },

  link: {
    ...Markdor.defaultRules.link,
    react: (node: any, output: any, state: any) => {
      return (
        <Link
          key={state.key}
          href={Markdor.sanitizeUrl(node.target) as string}
          target="_blank"
        >
          {output(node.content, state)}
        </Link>
      );
    },
  },
  url: {
    ...Markdor.defaultRules.url,
    react: (node: any, output: any, state: any) => {
      return (
        <Link
          key={state.key}
          href={Markdor.sanitizeUrl(node.target) as string}
          target="_blank"
        >
          {output(node.content, state)}
        </Link>
      );
    },
  },
};

var parser = Markdor.parserFor(rules as any);
var reactOutput = Markdor.outputFor(rules, "react");

export var markdown = function (source: string) {
  // Many rules require content to end in \n\n to be interpreted
  // as a block.
  var blockSource = source + "\n\n";
  var parseTree = parser(blockSource, { inline: false });

  var outputResult = reactOutput(parseTree);
  return outputResult;
};
