import * as React from "react";
import { Helmet } from "react-helmet";
import { PostHeader } from "./PostHeader";
import { GlobalCodeStyle } from "./GlobalCodeStyle";

type Props = {
  frontMatter: FrontMatter;
  postHTML: { __html: string };
};

export function Post({ postHTML, frontMatter }: Props) {
  return (
    <React.Fragment>
      <GlobalCodeStyle />
      <Helmet>
        <title>{frontMatter.title}</title>
        <meta name="description" content={frontMatter.description} />
        <link rel="stylesheet" href="/assets/styles/prism.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Fira+Mono"
        />
      </Helmet>

      <section>
        <PostHeader frontMatter={frontMatter} />
        <article dangerouslySetInnerHTML={postHTML} />
      </section>

      <a href="/blog">Back to blog</a>
    </React.Fragment>
  );
}
