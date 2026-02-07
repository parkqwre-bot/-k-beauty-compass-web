import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(locale: string) {
  const fullPath = path.join(postsDirectory, locale);
  const fileNames = fs.readdirSync(fullPath);
  const allPostsData = fileNames.map((fileName) => {
    const id = fileName.replace(/\.md$/, '');
    const fullFilePath = path.join(fullPath, fileName);
    const fileContents = fs.readFileSync(fullFilePath, 'utf8');
    const matterResult = matter(fileContents);

    return {
      id,
      ...(matterResult.data as { date: string; title: string; thumbnail: string; description: string }),
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

export function getAllPostIds(locale: string) {
  const fullPath = path.join(postsDirectory, locale);
  const fileNames = fs.readdirSync(fullPath);
  return fileNames.map((fileName) => {
    return {
      params: {
        id: fileName.replace(/\.md$/, ''),
        locale: locale,
      },
    };
  });
}

export async function getPostData(id: string, locale: string) {
  const fullPath = path.join(postsDirectory, locale, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const matterResult = matter(fileContents);
  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string; thumbnail: string; description: string }),
  };
}