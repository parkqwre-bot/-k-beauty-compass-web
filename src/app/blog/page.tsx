import Link from 'next/link';
import { getSortedPostsData } from '../../../lib/posts';

export default function Blog() {
  const allPostsData = getSortedPostsData();
  return (
    <section>
      <h2>Blog</h2>
      <ul>
        {allPostsData.map(({ id, date, title }) => (
          <li key={id}>
            <Link href={`/blog/${id}`}>{title}</Link>
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
