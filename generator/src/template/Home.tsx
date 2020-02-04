/* @jsx jsx */

import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Helmet } from "react-helmet";

type Props = {};

const styles = {
  pageContainer: css`
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  `,
  pageHeader: css`
    font-size: 2em;
  `,
  socialContainer: css`
    margin-bottom: 1em;
  `,
  socialLink: css`
    border-bottom: none;
    margin-right: 1em;

    &:last-child {
      margin-right: 0;
    }

    img {
      width: 25px;
    }
  `
};

const socialLinks = [
  {
    link: "https://github.com/ariafallah",
    img: "/assets/icons/github.svg",
    alt: "github logo"
  },
  {
    link: "http://stackoverflow.com/users/3772221",
    img: "/assets/icons/stackexchange.svg",
    alt: "stackoverflow logo"
  },
  {
    link: "https://linkedin.com/in/ariafallah",
    img: "/assets/icons/linkedin.svg",
    alt: "linkedin logo"
  },
  {
    link: "https://facebook.com/m0meni",
    img: "/assets/icons/facebook.svg",
    alt: "facebook logo"
  },
  {
    link: "https://instagram.com/m0meni",
    img: "/assets/icons/instagram.svg",
    alt: "instagram logo"
  },
  {
    link: "https://twitter.com/m0meni",
    img: "/assets/icons/twitter.svg",
    alt: "twitter logo"
  }
];

const projects = [
  <React.Fragment>
    An extremely fast{" "}
    <a href="https://github.com/AriaFallah/csv-parser">CSV parser</a> written in
    C++11.
  </React.Fragment>,
  <React.Fragment>
    An HTML5 canvas{" "}
    <a href="https://github.com/AriaFallah/aria.ai/tree/master/snake">
      snake game
    </a>{" "}
    written in ReasonML. <a href="/snake.html">Play here!</a>
  </React.Fragment>,
  <React.Fragment>
    A comprehensive beginner's{" "}
    <a href="https://github.com/AriaFallah/WebpackTutorial">webpack tutorial</a>{" "}
    with over 2000 stars on github.
  </React.Fragment>,
  <React.Fragment>
    A{" "}
    <a href="https://github.com/AriaFallah/aria.ai/tree/master/generator">
      static site generator
    </a>{" "}
    built on top of React and written in TypeScript.
  </React.Fragment>
];

export function Home(_: Props) {
  return (
    <div css={styles.pageContainer}>
      <Helmet>
        <meta name="description" content="Aria Fallah's Personal Website" />
        <title>Aria's Website</title>
      </Helmet>

      <h1 css={styles.pageHeader}>Aria Fallah</h1>
      <section css={styles.socialContainer}>
        {socialLinks.map(l => (
          <a css={styles.socialLink} key={l.alt} href={l.link}>
            <img src={l.img} alt={l.alt} />
          </a>
        ))}
      </section>

      <div>
        <section>
          <h2>Projects</h2>
          <ul>
            {projects.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginTop: "2em" }}>
          <h2>Photos</h2>
          <ul>
            <li>
              Like them on{" "}
              <a href="https://www.instagram.com/m0meni/">Instagram.</a>
            </li>
            <li>
              Download them from{" "}
              <a href="https://unsplash.com/@m0meni">Unsplash.</a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
