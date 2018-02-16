import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PostHeader } from './components/PostHeader';

interface Props {}

export class Home extends React.Component<Props> {
  render() {
    return (
      <>
        <Helmet>
          <meta name="description" content="Aria Fallah's Personal Website" />
          <title>Aria's Website</title>
        </Helmet>

        <h1>Aria Fallah</h1>
        <section className="social">
          <a href="https://github.com/ariafallah">
            <img src="/assets/icons/github.svg" alt="github logo" />
          </a>
          <a href="http://stackoverflow.com/users/3772221">
            <img
              src="/assets/icons/stackexchange.svg"
              alt="stackoverflow logo"
            />
          </a>
          <a href="https://linkedin.com/in/ariafallah">
            <img src="/assets/icons/linkedin.svg" alt="linkedin logo" />
          </a>
          <a href="/snake.html">
            <img src="/assets/icons/game.svg" alt="snake game" />
          </a>
          <a href="https://facebook.com/m0meni">
            <img src="/assets/icons/facebook.svg" alt="facebook logo" />
          </a>
          <a href="https://instagram.com/m0meni">
            <img src="/assets/icons/instagram.svg" alt="instagram logo" />
          </a>
          <a href="https://twitter.com/m0meni">
            <img src="/assets/icons/twitter.svg" alt="twitter logo" />
          </a>
        </section>
        <p>
          Studying computer science and mathematics at UMBC. Like to spend my
          time on side projects, photography, and blogging. Currently at
          FiscalNote. Joining Facebook after I graduate. Check out my{' '}
          <a href="/blog">blog</a> and my{' '}
          <a href="/assets/ariafallah_resume.pdf">resume.</a>
        </p>

        <section>
          <h2>Projects</h2>
          <ul>
            <li>
              An extremely fast{' '}
              <a href="https://github.com/AriaFallah/csv-parser">CSV parser</a>{' '}
              written in C++11.
            </li>
            <li>
              An HTML5 canvas{' '}
              <a href="https://github.com/AriaFallah/aria.ai/tree/master/snake">
                snake game
              </a>{' '}
              written in JavaScript + Flow. <a href="/snake.html">Play here!</a>
            </li>
            <li>
              A comprehensive beginner's{' '}
              <a href="https://github.com/AriaFallah/WebpackTutorial">
                webpack tutorial
              </a>{' '}
              with over 2000 stars on github.
            </li>
            <li>
              A{' '}
              <a href="https://github.com/AriaFallah/blog/tree/master/generator">
                static site generator
              </a>{' '}
              built on top of React and written in TypeScript.
            </li>
          </ul>
        </section>

        <section>
          <h2>
            <span>Photos</span>
          </h2>
          <ul>
            <li>
              Download them from{' '}
              <a href="https://unsplash.com/@m0meni">Unsplash.</a>
            </li>
            <li>
              Like them on{' '}
              <a href="https://www.instagram.com/m0meni/">Instagram.</a>
            </li>
          </ul>
        </section>
      </>
    );
  }
}
