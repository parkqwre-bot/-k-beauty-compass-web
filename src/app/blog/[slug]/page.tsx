import { getAllPostIds, getPostData } from '@/lib/posts';

// This function gets called at build time
export async function generateStaticParams() {
  const paths = getAllPostIds(['en', 'ko']); // Pass all supported locales
  return paths;
}

type Props = {
  params: { slug: string; locale: string }; // Add locale to params
};

export default async function BlogPostPage({ params }: Props) {
  const postData = await getPostData(params.slug, params.locale); // Pass locale to getPostData

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-2">{postData.title}</h1>
      <div className="text-gray-500 mb-8">
        {postData.date}
      </div>
      <div className="prose lg:prose-xl" dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
    </article>
  );
}
