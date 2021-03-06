/* @jsx jsx */
import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Helmet } from "react-helmet";
import { PostHeader } from "./PostHeader";

type Props = {
  posts: Post[];
};

const styles = {
  articlePreview: css`
    margin-bottom: 2em;
  `
};

export function Blog({ posts }: Props) {
  return (
    <React.Fragment>
      <Helmet>
        <meta
          name="description"
          content="Aria Fallah's blog about lots of things"
        />
        <title>Aria's Blog</title>
      </Helmet>
      {posts
        .slice()
        .sort((a, b) => {
          const aDate = new Date(a.frontMatter.date);
          const bDate = new Date(b.frontMatter.date);
          return bDate.getTime() - aDate.getTime();
        })
        .map(p => (
          <section css={styles.articlePreview} key={p.frontMatter.title}>
            <PostHeader frontMatter={p.frontMatter} />
            <div>
              <article dangerouslySetInnerHTML={{ __html: p.excerpt }} />
              <a href={`/blog/posts/${p.frontMatter.slug}.html`}>
                Keep reading
              </a>
            </div>
          </section>
        ))}
    </React.Fragment>
  );
}
