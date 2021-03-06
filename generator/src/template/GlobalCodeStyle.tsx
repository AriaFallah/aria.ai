/* @jsx jsx */
import { jsx, Global, css } from "@emotion/core";

type Props = {};

const styles = {
  global: css`
    code {
      font-family: "Fira Mono", monospace !important;
      font-size: 14px;
    }

    blockquote {
      color: #777;
      border-left: 0.25em solid #ddd;
      padding: 0 1em;
      margin-left: 0;
    }

    pre {
      counter-reset: line;
      overflow-x: auto;
    }

    span.line-number::before {
      counter-increment: line;
      content: counter(line);
      display: inline-block;
      padding: 0 0.5em;
      margin-right: 0.5em;
      color: #888;
    }
  `
};

export function GlobalCodeStyle(_: Props) {
  return <Global styles={styles.global} />;
}
