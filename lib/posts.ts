import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

// Gets the data for all posts in a specific language, sorted by date
export function getSortedPostsData(lang: string) {
  const postsDirectory = path.join(process.cwd(), 'posts', lang);
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { date: string; title: string }),
    };
  });

  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Gets all possible paths for all posts in all languages for static generation
export function getAllPostIds() {
  const languages = ['en', 'ko'];
  let allPaths: { params: { lang: string; slug: string } }[] = [];

  for (const lang of languages) {
    const postsDirectory = path.join(process.cwd(), 'posts', lang);
    if (fs.existsSync(postsDirectory)) {
      const fileNames = fs.readdirSync(postsDirectory);
      const paths = fileNames.map((fileName) => ({
        params: {
          lang,
          slug: fileName.replace(/\.md$/, ''),
        },
      }));
      allPaths = allPaths.concat(paths);
    }
  }
  return allPaths;
}

// Gets the content of a specific post for a specific language
export async function getPostData(lang: string, slug: string) {
  const postsDirectory = path.join(process.cwd(), 'posts', lang);
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { date: string; title: string }),
  };
}