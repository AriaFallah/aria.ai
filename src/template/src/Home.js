const { css } = require("@emotion/core");
const React = require("react");
const { Helmet } = require("react-helmet");

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
  `,
};

const socialLinks = [
  {
    link: "https://github.com/ariafallah",
    img: "/assets/icons/github.svg",
    alt: "github logo",
  },
  {
    link: "http://stackoverflow.com/users/3772221",
    img: "/assets/icons/stackexchange.svg",
    alt: "stackoverflow logo",
  },
  {
    link: "https://linkedin.com/in/ariafallah",
    img: "/assets/icons/linkedin.svg",
    alt: "linkedin logo",
  },
  {
    link: "https://facebook.com/m0meni",
    img: "/assets/icons/facebook.svg",
    alt: "facebook logo",
  },
  {
    link: "https://instagram.com/m0meni",
    img: "/assets/icons/instagram.svg",
    alt: "instagram logo",
  },
  {
    link: "https://twitter.com/m0meni",
    img: "/assets/icons/twitter.svg",
    alt: "twitter logo",
  },
];

export function Home() {
  return (
    <div css={styles.pageContainer}>
      <Helmet>
        <meta name="description" content="Aria Fallah's Personal Website" />
        <title>Aria's Website</title>
      </Helmet>

      <h1 css={styles.pageHeader}>Aria Fallah</h1>
      <section css={styles.socialContainer}>
        {socialLinks.map((l) => (
          <a css={styles.socialLink} key={l.alt} href={l.link}>
            <img src={l.img} alt={l.alt} />
          </a>
        ))}
      </section>
    </div>
  );
}
