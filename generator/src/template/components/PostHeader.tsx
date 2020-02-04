/* @jsx jsx */
import { jsx } from "@emotion/core";
import * as React from "react";
import * as Styles from "../styles/PostHeader.styles";

type Props = {
  frontMatter: FrontMatter;
};

export function PostHeader({ frontMatter }: Props) {
  return (
    <header css={Styles.postHeader}>
      <h1>
        <a href={`/blog/posts/${frontMatter.slug}.html`}>{frontMatter.title}</a>
      </h1>
      <h4>{frontMatter.description}</h4>
      <time>{frontMatter.date.toDateString()}</time>
    </header>
  );
}
