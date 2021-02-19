use regex::Regex;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use std::process::{Command, Stdio};
use std::str;
use walkdir::WalkDir;

#[derive(Deserialize, Debug)]
struct Config {
    content_dir: String,
    build_dir: String,
    template_dir: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct PostFrontmatter {
    date: String,
    title: String,
    slug: String,
    description: String,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Post {
    front_matter: PostFrontmatter,
    body: String,
    excerpt: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct ThoughtFrontmatter {
    date: String,
}

#[derive(Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Thought {
    front_matter: ThoughtFrontmatter,
    body: String,
}

#[derive(Serialize)]
struct MessageOut {
    posts: Vec<Post>,
    thoughts: Vec<Thought>,
}

#[derive(Deserialize)]
struct MessageIn {
    root_pages: Vec<(String, String)>,
    post_pages: Vec<(String, String)>,
}

fn main() {
    let config_file_path = PathBuf::from(
        env::args()
            .nth(1)
            .expect("Did not provide config file path as argument"),
    );
    let parsed_config: Config =
        toml::from_str(str::from_utf8(fs::read(&config_file_path).unwrap().as_ref()).unwrap())
            .unwrap();

    let parent_dir = config_file_path
        .parent()
        .unwrap()
        .to_owned()
        .canonicalize()
        .unwrap();
    let build_dir = parent_dir.join(parsed_config.build_dir);
    let content_dir = parent_dir.join(parsed_config.content_dir);
    let assets_src_dir = content_dir.join("assets");
    let blog_src_dir = content_dir.join("blog");
    let thoughts_src_dir = content_dir.join("thoughts");
    let assets_out_dir = build_dir.join("assets");
    let blog_out_dir = build_dir.join("blog").join("posts");
    let thoughts_out_dir = build_dir.join("thoughts");

    fs::create_dir_all(&blog_out_dir).unwrap();
    fs::create_dir_all(&thoughts_out_dir).unwrap();
    for entry in WalkDir::new(&assets_src_dir) {
        let entry_path = entry.unwrap().path().to_owned();
        let new_path = assets_out_dir.join(entry_path.strip_prefix(&assets_src_dir).unwrap());
        if entry_path.is_file() {
            fs::copy(entry_path, new_path).unwrap();
        } else {
            fs::create_dir_all(new_path).unwrap();
        }
    }

    let options = pulldown_cmark::Options::all();
    let frontmatter_regex = Regex::new(r"(?s)---([\s\S]*?)---\S*\s*(.*)").unwrap();
    let posts: Vec<Post> = fs::read_dir(&blog_src_dir)
        .unwrap()
        .map(|entry| {
            let entry_path = entry.unwrap().path().to_owned();
            let contents = String::from_utf8(fs::read(&entry_path).unwrap()).unwrap();
            let captures = frontmatter_regex
                .captures(&contents)
                .expect(&format!("Missing frontmatter from post {:?}", entry_path));

            let body = &captures[2];
            let parser = pulldown_cmark::Parser::new_ext(body, options);
            let mut html_buf = String::new();
            pulldown_cmark::html::push_html(&mut html_buf, parser);

            let (idx, _) = html_buf.match_indices("<!--more-->").nth(0).unwrap();

            Post {
                front_matter: serde_json::from_str(&captures[1]).unwrap(),
                body: html_buf.replace("<!--more-->", ""),
                excerpt: String::from(&html_buf[0..idx]),
            }
        })
        .collect();

    let thoughts: Vec<Thought> = fs::read_dir(&thoughts_src_dir)
        .unwrap()
        .map(|entry| {
            let entry_path = entry.unwrap().path().to_owned();
            let contents = String::from_utf8(fs::read(&entry_path).unwrap()).unwrap();
            let captures = frontmatter_regex
                .captures(&contents)
                .expect(&format!("Missing frontmatter from post {:?}", entry_path));

            let body = &captures[2];
            let parser = pulldown_cmark::Parser::new_ext(body, options);
            let mut html_buf = String::new();
            pulldown_cmark::html::push_html(&mut html_buf, parser);

            Thought {
                front_matter: serde_json::from_str(&captures[1]).unwrap(),
                body: String::from(html_buf),
            }
        })
        .collect();

    let message = serde_json::to_string(&MessageOut {
        posts: posts,
        thoughts: thoughts,
    })
    .unwrap();

    let mut child = Command::new("yarn")
        .arg("--silent")
        .arg("--cwd")
        .arg(parent_dir.join(&parsed_config.template_dir))
        .arg("start")
        .stdin(Stdio::piped())
        .stdout(Stdio::piped())
        .spawn()
        .unwrap();

    child
        .stdin
        .as_mut()
        .unwrap()
        .write_all(message.as_bytes())
        .unwrap();

    let output = child.wait_with_output().unwrap().stdout;
    let json_str = str::from_utf8(&output).unwrap();

    let payload: MessageIn = serde_json::from_str(json_str).unwrap();

    for (name, html) in payload.root_pages.into_iter() {
        let new_path = build_dir.join(&name);
        fs::write(new_path, html).unwrap();
    }

    for (name, html) in payload.post_pages.into_iter() {
        let mut new_path = blog_out_dir.join(name);
        new_path.set_extension("html");
        fs::write(new_path, html).unwrap();
    }
}
