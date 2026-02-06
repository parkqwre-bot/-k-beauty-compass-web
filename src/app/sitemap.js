import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Helper function to recursively find all files with a specific extension
const getFilesRecursively = (dir, ext, files = []) => {
  if (!fs.existsSync(dir)) {
    console.warn(`Directory not found: ${dir}`);
    return files;
  }
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);
    if (item.isDirectory()) {
      getFilesRecursively(fullPath, ext, files);
    } else if (path.extname(fullPath) === ext) {
      files.push(fullPath);
    }
  }
  return files;
};

// This function will be called by Next.js to generate the sitemap
export default async function sitemap() {
  const siteUrl = 'https://k-beauty-compass-web.vercel.app'; // Your site's base URL

  const postsDirectory = path.join(process.cwd(), 'posts');
  const filePaths = getFilesRecursively(postsDirectory, '.md');

  const postsByBaseName = filePaths.reduce((acc, filePath) => {
    const baseName = path.basename(filePath, '.md');
    if (!acc[baseName]) {
      acc[baseName] = {};
    }
    const lang = filePath.includes(path.join('posts', 'en')) ? 'en' : 'ko';
    acc[baseName][lang] = filePath;
    return acc;
  }, {});

  const sitemapItems = Object.entries(postsByBaseName).flatMap(([baseName, langFiles]) => {
    // Determine lastmod from the latest post date available
    let latestLastMod = new Date().toISOString();
    if (langFiles.en) {
      const fileContents = fs.readFileSync(langFiles.en, 'utf8');
      const { data } = matter(fileContents);
      if (data.date) latestLastMod = new Date(data.date).toISOString();
    } else if (langFiles.ko) {
      const fileContents = fs.readFileSync(langFiles.ko, 'utf8');
      const { data } = matter(fileContents);
      if (data.date) latestLastMod = new Date(data.date).toISOString();
    }

    const alternates = [];
    if (langFiles.en) alternates.push({ loc: `${siteUrl}/en/blog/${baseName}`, lang: 'en' });
    if (langFiles.ko) alternates.push({ loc: `${siteUrl}/ko/blog/${baseName}`, lang: 'ko' });

    const entries = [];
    if (langFiles.en) {
      entries.push({
        url: `${siteUrl}/en/blog/${baseName}`,
        lastModified: latestLastMod,
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: alternates.reduce((acc, alt) => {
            acc[alt.lang] = alt.loc;
            return acc;
          }, {}),
        },
      });
    }
    if (langFiles.ko) {
      entries.push({
        url: `${siteUrl}/ko/blog/${baseName}`,
        lastModified: latestLastMod,
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: alternates.reduce((acc, alt) => {
            acc[alt.lang] = alt.loc;
            return acc;
          }, {}),
        },
      });
    }
    return entries;
  });

  // Add the homepage and other static pages
  const staticPages = [
    {
      url: siteUrl,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 1.0,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          ko: `${siteUrl}/ko`,
        },
      },
    },
    // Add other static pages like /en, /ko, etc. if they exist and are not already covered
    {
      url: `${siteUrl}/en`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          ko: `${siteUrl}/ko`,
        },
      },
    },
    {
      url: `${siteUrl}/ko`,
      lastModified: new Date().toISOString(),
      changeFrequency: 'daily',
      priority: 0.8,
      alternates: {
        languages: {
          en: `${siteUrl}/en`,
          ko: `${siteUrl}/ko`,
        },
      },
    },
  ];


  return [...staticPages, ...sitemapItems];
}
