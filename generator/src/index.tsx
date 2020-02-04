import * as fs from "fs-extra";
import * as path from "path";
import * as React from "react";
import { Home } from "./template/Home";
import { Post } from "./template/Post";
import { Blog } from "./template/Blog";
import {
  makePage,
  extractFrontMatter,
  extractExcerpt,
  renderMarkdown
} from "./util";
import { Thoughts } from "./template/Thoughts";

const SRC_DIR = path.join(__dirname, "..", "..", "content");
const BUILD_DIR = path.join(__dirname, "..", "..", "build");
const ASSETS_SRC_DIR = path.join(SRC_DIR, "assets");
const POST_SRC_DIR = path.join(SRC_DIR, "blog");
const THOUGHT_SRC_DIR = path.join(SRC_DIR, "thoughts");
const ASSETS_OUT_DIR = path.join(BUILD_DIR, "assets");
const POST_OUT_DIR = path.join(BUILD_DIR, "blog", "posts");
const THOUGHT_OUT_DIR = path.join(BUILD_DIR, "thoughts");

async function main() {
  console.log("Building site...");
  fs.mkdirpSync(POST_OUT_DIR);
  fs.mkdirpSync(THOUGHT_OUT_DIR);
  fs.copySync(ASSETS_SRC_DIR, ASSETS_OUT_DIR);

  const postFiles = fs.readdirSync(POST_SRC_DIR);
  const thoughtFiles = fs.readdirSync(THOUGHT_SRC_DIR);

  const postsPromises = Promise.all(
    postFiles.map(file => fs.readFile(path.join(POST_SRC_DIR, file), "utf8"))
  ).then(posts =>
    posts.map((p, i) => {
      const file = postFiles[i];
      const { body, frontMatter } = extractFrontMatter(file, p);
      return {
        frontMatter,
        ...extractExcerpt(file, renderMarkdown(body))
      };
    })
  );

  const thoughtsPromises = Promise.all(
    thoughtFiles.map(file =>
      fs.readFile(path.join(THOUGHT_SRC_DIR, file), "utf8")
    )
  ).then(thoughts =>
    thoughts.map((t, i) => {
      const file = thoughtFiles[i];
      const { body, frontMatter } = extractFrontMatter(file, t);
      return {
        frontMatter,
        body: renderMarkdown(body)
      };
    })
  );

  // @ts-ignore Promise.all typechecking is broken
  const [posts, thoughts]: [Post[], Thought[]] = await Promise.all([
    postsPromises,
    thoughtsPromises
  ]);

  const outFilePaths = [
    ...posts.map(p => path.join(POST_OUT_DIR, p.frontMatter.slug + ".html")),
    path.join(BUILD_DIR, "index.html"),
    path.join(BUILD_DIR, "blog", "index.html"),
    path.join(BUILD_DIR, "thoughts", "index.html")
  ];

  const rootPages = [
    makePage(<Home />, { activeTab: "home" }),
    makePage(<Blog posts={posts} />, { activeTab: "blog" }),
    makePage(<Thoughts thoughts={thoughts} />, { activeTab: "thoughts" })
  ];
  const postPages = posts.map(p =>
    makePage(
      <Post frontMatter={p.frontMatter} postHTML={{ __html: p.body }} />,
      { activeTab: "blog" }
    )
  );

  await Promise.all(
    [...postPages, ...rootPages].map((page, i) =>
      fs.writeFile(outFilePaths[i], page)
    )
  );

  console.log("done!");
}

main().catch(e => console.log(e));
