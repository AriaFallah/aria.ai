import * as React from 'react';
import { Helmet } from 'react-helmet';
import { PostHeader } from './components/PostHeader';

interface Props {
  posts: Post[];
}

export class Blog extends React.Component<Props> {
  render() {
    const posts = this.props.posts.slice();
    return (
      <>
        <Helmet>
          <meta
            name="description"
            content="Aria Fallah's blog about lots of things"
          />
          <title>Aria's Blog</title>
        </Helmet>
        {posts
          .sort((a, b) => {
            const aDate = new Date(a.frontMatter.date);
            const bDate = new Date(b.frontMatter.date);
            return bDate.getTime() - aDate.getTime();
          })
          .map(p => (
            <section className="article-preview" key={p.frontMatter.title}>
              <PostHeader frontMatter={p.frontMatter} />
              <div>
                <article dangerouslySetInnerHTML={{ __html: p.excerpt }} />
                <a href={`/blog/posts/${p.frontMatter.slug}.html`}>
                  Keep reading
                </a>
              </div>
            </section>
          ))}
      </>
    );
  }
}
