const { css } = require("@emotion/core");
const React = require("react");
const { Helmet } = require("react-helmet");
const { GlobalCodeStyle } = require("./GlobalCodeStyle");

const styles = {
  header: css`
    margin-bottom: 15px;
  `,
  thoughtContainer: css`
    align-items: flex-start;
    display: flex;
    margin-bottom: 15px;

    @media (max-width: 500px) {
      flex-direction: column;
      a {
        margin-bottom: 10px;
      }
    }
  `,
  thoughtDate: css`
    flex-shrink: 0;
    margin-right: 10px;
  `,
  thoughtContent: css`
    p:first-of-type {
      margin-top: 0;
    }
  `,
};

export function Thoughts({ thoughts }) {
  return (
    <React.Fragment>
      <GlobalCodeStyle />
      <Helmet>
        <meta name="description" content="Aria Fallah's thoughts" />
        <title>Aria's Thoughts</title>
        <link rel="stylesheet" href="/assets/styles/prism.css" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Fira+Mono"
        />
      </Helmet>
      <div css={styles.header}>
        I heard there's something called twitter for this...
      </div>
      {thoughts
        .slice()
        .sort((a, b) => {
          const aDate = new Date(a.frontMatter.date);
          const bDate = new Date(b.frontMatter.date);
          return bDate.getTime() - aDate.getTime();
        })
        .map((t) => {
          const date = t.frontMatter.date.toISOString();
          return (
            <div key={date} css={styles.thoughtContainer}>
              <a id={date} href={`#${date}`} css={styles.thoughtDate}>
                [{date.split("T")[0]}]
              </a>
              <article
                css={styles.thoughtContent}
                dangerouslySetInnerHTML={{ __html: t.body }}
              />
            </div>
          );
        })}
    </React.Fragment>
  );
}
