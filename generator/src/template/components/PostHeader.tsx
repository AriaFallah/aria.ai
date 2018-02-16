import * as React from 'react';
import { Helmet } from 'react-helmet';

interface Props {
  frontMatter: FrontMatter;
}

export class PostHeader extends React.Component<Props> {
  render() {
    const { frontMatter } = this.props;
    return (
      <header className="post-header">
        <h2>
          <a href={`/blog/posts/${frontMatter.slug}.html`}>
            {frontMatter.title}
          </a>
        </h2>
        <h5>{frontMatter.description}</h5>
        <time>{frontMatter.date.toDateString()}</time>
      </header>
    );
  }
}
