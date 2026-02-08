// Temporary comment to force a clean Vercel deployment
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'posts');

export function getSortedPostsData(locale: string) {
  const fullPath = path.join(postsDirectory, locale);
  const fileNames = fs.readdirSync(fullPath); // Note: fs.readdirSync can throw if directory doesn't exist/is inaccessible
      const allPostsData = fileNames.map((fileName) => {
        const id = fileName.replace(/\.md$/, '');
        const fullFilePath = path.join(fullPath, fileName);
        let fileContents: string;
        try {
          fileContents = fs.readFileSync(fullFilePath, 'utf8');
        } catch (readError) {
          console.error(`Error reading file for post ${id} in locale ${locale} during getSortedPostsData:`, readError);
          return {
            id,
            date: '2000-01-01', // Fallback date, will sort to bottom
            title: `Error: Post '${id}' not found or unreadable.`,
            thumbnail: '',
            description: 'This post could not be loaded due to a file read error.',
            isError: true, // Mark as an error post
          };
        }
  
        try {
          const matterResult = matter(fileContents);
          return {
            id,
            ...(matterResult.data as { date: string; title: string; thumbnail: string; description: string }),
            isError: false, // Mark as not an error post
          };
        } catch (e) {
          console.error(`Error parsing frontmatter (YAML) for file: ${fileName} in locale ${locale} during getSortedPostsData:`, e);
          // Return a minimal valid structure for posts that fail to parse
          return {
            id,
            date: '2000-01-01', // Fallback date, will sort to bottom
            title: `Error: YAML parsing failed for '${id}'.`,
            thumbnail: '',
            description: 'This post has a YAML parsing error. Please check YAML syntax.',
            isError: true, // Mark as an error post
          };
        }
      });
  return allPostsData.sort((a, b) => {
    // Error posts with date '2000-01-01' will naturally sort to the bottom
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
  let fileContents: string;
  try {
    fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (readError) {
    console.error(`Error reading file for post ${id} in locale ${locale}:`, readError);
    return {
      id,
      contentHtml: '<h1>Error loading post content.</h1><p>The file could not be read.</p>',
      date: '2000-01-01', // Fallback date
      title: `Error: Post not found or unreadable: ${id}`,
      thumbnail: '',
      description: 'This post could not be loaded due to a file read error.',
    };
  }

  let matterResult;
  try {
    matterResult = matter(fileContents);
  } catch (parseError) {
    console.error(`Error parsing frontmatter for post ${id} in locale ${locale}:`, parseError);
    return {
      id,
      contentHtml: '<h1>Error loading post content.</h1><p>The frontmatter could not be parsed. Please check for YAML syntax errors.</p>',
      date: '2000-01-01', // Fallback date
      title: `Error: Frontmatter parsing failed for ${id}`,
      thumbnail: '',
      description: 'This post has a frontmatter parsing error.',
    };
  }

  const processedContent = await remark().use(html).process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    id,
    contentHtml,
    ...(matterResult.data as { date: string; title: string; thumbnail: string; description: string }),
  };
}