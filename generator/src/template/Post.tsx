/* @jsx jsx */
import { jsx, Global } from "@emotion/core";
import * as React from "react";
import { Helmet } from "react-helmet";
import { PostHeader } from "./components/PostHeader";
import * as Styles from "./styles/Post.styles";

type Props = {
  frontMatter: FrontMatter;
  postHTML: { __html: string };
};

export function Post({ postHTML, frontMatter }: Props) {
  return (
    <React.Fragment>
      <Helmet>
        <title>{frontMatter.title}</title>
        <meta name="description" content={frontMatter.description} />
        <link rel="stylesheet" href="/assets/styles/prism.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Fira+Mono"
        />
      </Helmet>
      <Global styles={Styles.global} />
      <section>
        <PostHeader frontMatter={frontMatter} />
        <article dangerouslySetInnerHTML={postHTML} />
      </section>

      <a href="/blog">Back to blog</a>
    </React.Fragment>
  );
}
