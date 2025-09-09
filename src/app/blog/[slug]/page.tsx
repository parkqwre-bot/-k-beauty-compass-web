import { getPostData, getAllPostIds } from '../../../../lib/posts';

export async function generateStaticParams() {
    const paths = getAllPostIds();
    // The paths returned by getAllPostIds are already in the correct format.
    // [{ params: { slug: '...' } }, ...]
    // However, generateStaticParams expects an array of slug objects directly.
    // So we need to map over the paths to extract the slug.
    return paths.map(path => ({ slug: path.params.slug }));
}

export default async function Post({ params }: { params: { slug: string } }) {
  const postData = await getPostData(params.slug);
  return (
    <article>
      <h1>{postData.title}</h1>
      <div>
        {postData.date}
      </div>
      <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
