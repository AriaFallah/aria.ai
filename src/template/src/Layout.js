const { css } = require("@emotion/core");
const React = require("react");
const { Helmet } = require("react-helmet");

const styles = {
  content: css`
    max-width: 800px;
    display: block;
    width: 100%;
    flex: 1 0 auto;
    margin: 0 auto;
  `,
  footer: css`
    flex-shrink: 0;
    padding-left: 10px;
    padding-bottom: 10px;
    margin-top: 25px;
  `,
  main: css`
    @media (max-width: 800px) {
      padding: 0 10px;
    }
  `,
  nav: css`
    border-bottom: 4px solid black;
    margin: 0 auto;
    display: flex;
    align-items: center;
    margin-bottom: 1em;
    padding: 5px 0;

    @media (max-width: 800px) {
      padding: 5px 10px;
    }
  `,
  navIcon: css`
    border-bottom: 0;
    margin-right: 1em;

    img {
      width: 35px;
    }
  `,
  navLink: css`
    font-style: normal;
    color: black !important;
    border-bottom: 0 !important;
    margin-right: 1em;
  `,
  navLinkActive: css`
    font-style: italic;
    color: white !important;
    background-color: black;
    padding-left: 5px;
    padding-right: 8px;
  `,
};

function NavLink({ children, href, isActive }) {
  return (
    <a css={[styles.navLink, isActive && styles.navLinkActive]} href={href}>
      {children}
    </a>
  );
}

export function Layout({ activeTab, children }) {
  return (
    <React.Fragment>
      <Helmet>
        <meta name="HandheldFriendly" content="True" />
        <meta http-equiv="cache-control" content="max-age=0" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta
          name="google-site-verification"
          content="bbTP0B3Joyt2uJViZb5qeGxHhf4TSIgntjl3fitB6Mc"
        />
      </Helmet>

      <div css={styles.content}>
        <nav css={styles.nav}>
          <a css={styles.navIcon} href="/">
            <img src="/assets/icons/logo.svg" alt="site logo" />
          </a>
          <NavLink isActive={activeTab === "home"} href="/">
            Home
          </NavLink>
          <NavLink isActive={activeTab === "blog"} href="/blog">
            Blog
          </NavLink>
          <NavLink isActive={activeTab === "thoughts"} href="/thoughts">
            Thoughts
          </NavLink>
        </nav>

        <main css={styles.main}>{children}</main>
      </div>

      <footer css={styles.footer}>
        <div>
          Aria Fallah <a href="/snake.html">©</a>
        </div>
        <div>All Rights Reserved - {new Date().getFullYear()}</div>
      </footer>
    </React.Fragment>
  );
}
