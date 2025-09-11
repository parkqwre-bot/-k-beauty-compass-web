import { getPostData, getAllPostIds } from '../../../../../lib/posts';

// This function generates all possible static paths for all languages and slugs
export async function generateStaticParams() {
    const paths = getAllPostIds();
    return paths;
}

export default async function Post({ params }: { params: { lang: string, slug: string } }) {
  // Fetch post data for the given language and slug
  const postData = await getPostData(params.lang, params.slug);
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