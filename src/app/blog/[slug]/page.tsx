type Props = {
  params: { slug: string };
};

export default function BlogPostPage({ params }: Props) {
  // Later, we will fetch content based on the slug
  const { slug } = params;

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Blog Post Title for: {slug}</h1>
      <div className="prose lg:prose-xl">
        <p>
          This is the content for the blog post. Later, this will be populated from a Markdown file corresponding to the slug "{slug}".
        </p>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>
    </article>
  );
}
