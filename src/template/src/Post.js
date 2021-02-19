const React = require("react");
const { Helmet } = require("react-helmet");
const { PostHeader } = require("./PostHeader");
const { GlobalCodeStyle } = require("./GlobalCodeStyle");

export function Post({ postHTML, frontMatter }) {
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
