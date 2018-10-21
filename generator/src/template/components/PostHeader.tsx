/* @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import * as Styles from '../styles/PostHeader.styles';

interface Props {
  frontMatter: FrontMatter;
}

export class PostHeader extends React.Component<Props> {
  render() {
    const { frontMatter } = this.props;
    return (
      <header css={Styles.postHeader}>
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
