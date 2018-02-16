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
        <h1>
          <a href={`/blog/posts/${frontMatter.slug}.html`}>
            {frontMatter.title}
          </a>
        </h1>
        <h4>{frontMatter.description}</h4>
        <time>{frontMatter.date.toDateString()}</time>
      </header>
    );
  }
}
