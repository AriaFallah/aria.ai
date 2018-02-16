import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PostHeader } from './components/PostHeader';

interface Props {
  postHtml: { __html: string };
  frontMatter: FrontMatter;
}

export class Post extends React.Component<Props> {
  render() {
    const { frontMatter, postHtml } = this.props;
    return (
      <>
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
          <article dangerouslySetInnerHTML={postHtml} />
        </section>
      </>
    );
  }
}
