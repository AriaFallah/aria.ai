type FrontMatter = {
  date: Date;
  title: string;
  slug: string;
  description: string;
};

type Post = {
  frontMatter: FrontMatter;
  body: string;
  excerpt: string;
};
