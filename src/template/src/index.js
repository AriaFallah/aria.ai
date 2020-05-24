const React = require("react");
const { Helmet } = require("react-helmet");
const { renderToStaticMarkup } = require("react-dom/server");
const { Home } = require("./Home");
const { Post } = require("./Post");
const { Blog } = require("./Blog");
const { Thoughts } = require("./Thoughts");
const { Layout } = require("./Layout");

function makePage(pageContent, layoutProps) {
  const body = renderToStaticMarkup(
    <Layout {...layoutProps}>{pageContent}</Layout>
  );
  const helmet = Helmet.renderStatic();
  return `
  <!doctype html>
  <html lang="en">
    <head>
      ${helmet.title.toString()}
      <meta charset="utf-8" />
      ${helmet.meta.toString()}
      ${helmet.link.toString()}
      <link
        rel="shortcut icon"
        type="image/png"
        href=/assets/icons/favicon.ico
      />
      <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Source+Serif+Pro">
      <style>
      * {
        box-sizing: border-box;
      }
      
      html {
        font: 100%/1.45em 'Source Serif Pro', serif;
        height: 100%;
      }

      body {
        display: flex;
        flex-direction: column;
        height: 100%;
        margin: 0;
        color: rgba(0, 0, 0, 0.85);
        word-wrap: break-word;
        font-kerning: normal;
        background-color: #fcfcfc;
      }
      
      h1 {
        font-size: 1.5em;
      }
      
      h1,
      h2,
      h3,
      h4,
      h5,
      h6 {
        margin-top: 0;
        line-height: 1.25em;
        margin-bottom: 0.75rem;
        font-weight: bold;
        text-rendering: optimizeLegibility;
      }
      
      hr {
        border: 1px solid #ddd;
      }
      
      a {
        color: rgba(26, 13, 171, 0.85);
        text-decoration: none;
        border-bottom: 2px solid rgba(26, 13, 171, 0.85);
      }
      
      a:visited {
        color: rgba(102, 0, 153, 0.8);
        border-bottom: 2px solid rgba(102, 0, 153, 0.8);
      }
      
      a:active,
      a:hover {
        outline-width: 0;
      }
      </style>
    </head>
    <body ${helmet.bodyAttributes.toString()}>
      ${body}
      <!-- Global site tag (gtag.js) - Google Analytics -->
      <script async src="https://www.googletagmanager.com/gtag/js?id=UA-79031036-2"></script>
      <script>
        if (location.hostname !== 'localhost' && location.hostname !== '127.0.0.1') {
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'UA-79031036-2');
        }
      </script>
    </body>
  </html>`;
}

function processData({ posts, thoughts }) {
  const rootPages = [
    ["index.html", makePage(<Home />, { activeTab: "home" })],
    [
      "blog/index.html",
      makePage(<Blog posts={posts} />, { activeTab: "blog" }),
    ],
    [
      "thoughts/index.html",
      makePage(<Thoughts thoughts={thoughts} />, { activeTab: "thoughts" }),
    ],
  ];

  const postPages = posts.map((p) => [
    p.frontMatter.slug,
    makePage(
      <Post frontMatter={p.frontMatter} postHTML={{ __html: p.body }} />,
      { activeTab: "blog" }
    ),
  ]);

  return {
    root_pages: rootPages,
    post_pages: postPages,
  };
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (serializedData) => {
  const { posts, thoughts } = JSON.parse(serializedData);
  for (const post of posts) {
    post.frontMatter.date = new Date(post.frontMatter.date);
  }
  for (const thought of thoughts) {
    thought.frontMatter.date = new Date(thought.frontMatter.date);
  }

  const output = JSON.stringify(processData({ posts, thoughts }));
  process.stdout.write(output);
});
