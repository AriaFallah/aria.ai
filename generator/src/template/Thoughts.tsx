/* @jsx jsx */
import { Global, css, jsx } from "@emotion/core";
import * as React from "react";
import { Helmet } from "react-helmet";
import * as PostStyles from "./styles/Post.styles";

interface Props {
  thoughts: Thought[];
}

export class Thoughts extends React.Component<Props> {
  render() {
    const thoughts = this.props.thoughts.slice();
    return (
      <React.Fragment>
        <Helmet>
          <meta name="description" content="Aria Fallah's thoughts" />
          <title>Aria's Thoughts</title>
          <link rel="stylesheet" href="/assets/styles/prism.css" />
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Fira+Mono"
          />
        </Helmet>
        <Global styles={PostStyles.global} />
        <div css={{ marginBottom: 15 }}>
          I heard there's something called twitter for this...
        </div>
        {thoughts
          .sort((a, b) => {
            const aDate = new Date(a.frontMatter.date);
            const bDate = new Date(b.frontMatter.date);
            return bDate.getTime() - aDate.getTime();
          })
          .map(t => {
            const date = t.frontMatter.date.toISOString();
            return (
              <div
                key={date}
                css={css`
                  align-items: flex-start;
                  display: flex;
                  margin-bottom: 15px;

                  @media (max-width: 500px) {
                    flex-direction: column;
                    a {
                      margin-bottom: 10px;
                    }
                  }
                `}
              >
                <a
                  id={date}
                  href={`#${date}`}
                  css={{ flexShrink: 0, marginRight: 10 }}
                >
                  [{date.split("T")[0]}]
                </a>
                <article
                  css={css`
                    p:first-of-type {
                      margin-top: 0;
                    }
                  `}
                  dangerouslySetInnerHTML={{ __html: t.body }}
                />
              </div>
            );
          })}
      </React.Fragment>
    );
  }
}
