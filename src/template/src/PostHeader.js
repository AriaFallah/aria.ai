const { css } = require("@emotion/core");
const React = require("react");

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
  `,
};

export function PostHeader({ frontMatter }) {
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
