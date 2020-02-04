/* @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";

type Props = {
  frontMatter: FrontMatter;
};

const styles = {
  postHeader: css`
    margin-bottom: 1em;

    a {
      border-bottom: none;
    }

    h1,
    h4 {
      margin: 0;
    }
  `
};

export function PostHeader({ frontMatter }: Props) {
  return (
    <header css={styles.postHeader}>
      <h1>
        <a href={`/blog/posts/${frontMatter.slug}.html`}>{frontMatter.title}</a>
      </h1>
      <h4>{frontMatter.description}</h4>
      <time>{frontMatter.date.toDateString()}</time>
    </header>
  );
}
