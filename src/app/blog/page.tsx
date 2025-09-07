import Link from 'next/link';
import { getSortedPostsData } from '@/lib/posts';

export default function BlogPage() {
  const allPosts = getSortedPostsData();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">K-Beauty Blog</h1>
      <div className="space-y-4">
        {allPosts.length > 0 ? (
          allPosts.map(({ id, date, title }) => (
            <div key={id} className="border p-4 rounded-lg">
              <Link href={`/blog/${id}`}>
                <h2 className="text-2xl font-semibold hover:text-pink-500">{title}</h2>
              </Link>
              <small className="text-gray-500">
                {date}
              </small>
            </div>
          ))
        ) : (
          <p>No posts found. Please contact the administrator.</p>
        )}
      </div>
    </div>
  );
}
