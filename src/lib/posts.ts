import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getSortedPostsData(locale: string) {
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith(`.${locale}.md`))
    .map((fileName) => {
      const id = fileName.replace(/\.(en|ko)\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        id,
        ...(matterResult.data as { title: string; date: string }),
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

export function getAllPostIds(locales: string[]) {
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.flatMap((fileName) => {
    const id = fileName.replace(/\.(en|ko)\.md$/, '');
    return locales.map(locale => ({
      params: {
        slug: id,
        locale: locale,
      },
    }));
  });
}

export async function getPostData(slug: string, locale: string) {
  const fullPath = path.join(postsDirectory, `${slug}.${locale}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);

  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    contentHtml,
    ...(matterResult.data as { title: string; date: string }),
  };
}
