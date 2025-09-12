import Link from 'next/link';
import { getSortedPostsData } from '../../../../lib/posts';

// Forcing a rebuild to clear cache issues
export default function Blog({ params }: { params: { lang: string } }) {
  const allPostsData = getSortedPostsData(params.lang);
  const pageTitle = params.lang === 'ko' ? '블로그' : 'Blog';

  return (
    <section>
      <h1>K-Beauty Compass {pageTitle}</h1>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/${params.lang}/blog/${id}`}>{title}</Link>
            <br />
            <small>
              {date}
            </small>
          </li>
        ))}
      </ul>
    </section>
  );
}