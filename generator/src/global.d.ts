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

type Thought = {
  frontMatter: { date: Date };
  body: string;
};
