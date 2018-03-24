import * as React from 'react';
import { Helmet } from 'react-helmet';

const CURRENT_YEAR = new Date().getFullYear();

interface Props {
  activeTab: 'home' | 'blog';
}

export class Site extends React.Component<Props> {
  render() {
    const { activeTab } = this.props;

    return (
      <>
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

        <div className="content">
          <nav className="nav">
            <a href="/" className={activeTab === 'home' ? 'active' : undefined}>
              Home
            </a>
            <a
              href="/blog"
              className={activeTab === 'blog' ? 'active' : undefined}
            >
              Blog
            </a>
          </nav>

          <main className="main">{this.props.children}</main>
        </div>

        <footer className="footer">
          <div>
            Aria Fallah <a href="/snake.html">©</a>
          </div>
          <div>All Rights Reserved - {CURRENT_YEAR}</div>
        </footer>
      </>
    );
  }
}
