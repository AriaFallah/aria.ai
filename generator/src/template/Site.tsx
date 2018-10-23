/* @jsx jsx */
import { jsx } from '@emotion/core';
import * as React from 'react';
import { Helmet } from 'react-helmet';
import * as Styles from './styles/Site.styles';

const CURRENT_YEAR = new Date().getFullYear();

interface Props {
  activeTab: 'home' | 'blog' | 'thoughts';
}

export class Site extends React.Component<Props> {
  render() {
    const { activeTab } = this.props;

    return (
      <React.Fragment>
        <Helmet>
          <meta name="HandheldFriendly" content="True" />
          <meta http-equiv="cache-control" content="max-age=0" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1.0"
          />
          <meta
            name="google-site-verification"
            content="bbTP0B3Joyt2uJViZb5qeGxHhf4TSIgntjl3fitB6Mc"
          />
        </Helmet>

        <div css={Styles.content}>
          <nav css={Styles.nav}>
            <Styles.NavLink active={activeTab === 'home'} href="/">
              Home
            </Styles.NavLink>
            <Styles.NavLink active={activeTab === 'blog'} href="/blog">
              Blog
            </Styles.NavLink>
            <Styles.NavLink active={activeTab === 'thoughts'} href="/thoughts">
              Thoughts
            </Styles.NavLink>
          </nav>

          <main css={Styles.main}>{this.props.children}</main>
        </div>

        <footer css={Styles.footer}>
          <div>
            Aria Fallah <a href="/snake.html">©</a>
          </div>
          <div>All Rights Reserved - {CURRENT_YEAR}</div>
        </footer>
      </React.Fragment>
    );
  }
}
