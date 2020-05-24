use anyhow::{anyhow, Result};
use serde::Deserialize;
use std::env;
use std::fs;
use std::path::PathBuf;
use std::str;
use walkdir::WalkDir;

#[derive(Deserialize, Debug)]
struct Config {
    content_dir: String,
    build_dir: String,
}

fn run() -> Result<()> {
    let config_file_path = PathBuf::from(
        env::args()
            .nth(1)
            .ok_or(anyhow!("Did not provide config file path as argument"))?,
    );
    let parent_dir = config_file_path
        .parent()
        .ok_or(anyhow!(
            "Could not determine parent directory of config file"
        ))?
        .to_owned()
        .canonicalize()?;

    let parsed_config: Config =
        toml::from_str(str::from_utf8(fs::read(config_file_path)?.as_ref())?)?;

    println!("Building site...");
    let build_dir = parent_dir.join(parsed_config.build_dir);
    let content_dir = parent_dir.join(parsed_config.content_dir);

    let assets_src_dir = content_dir.join("assets");
    let blog_src_dir = content_dir.join("blog");
    let thoughts_src_dir = content_dir.join("thoughts");
    let assets_out_dir = build_dir.join("assets");
    let blog_out_dir = build_dir.join("blog").join("posts");
    let thoughts_out_dir = build_dir.join("thoughts");

    println!("Creating directories...");
    fs::create_dir_all(blog_out_dir)?;
    fs::create_dir_all(thoughts_out_dir)?;

    println!("Copying assets...");
    for entry in WalkDir::new(assets_src_dir) {
        let entry_path = entry?.path().to_owned();
        let new_path = build_dir.join(entry_path.strip_prefix(&content_dir)?);
        if entry_path.is_file() {
            fs::copy(entry_path, new_path)?;
        } else {
            fs::create_dir_all(new_path)?;
        }
    }

    Ok(())
}

fn main() {
    match run() {
        Ok(_) => println!("success!"),
        Err(e) => println!("Error: {}!", e),
    }
}
