const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Function to recursively find all files with a specific extension
const getFilesRecursively = (dir, ext) => {
  let files = [];
  const items = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      files = files.concat(getFilesRecursively(fullPath, ext));
    } else if (path.extname(fullPath) === ext) {
      files.push(fullPath);
    }
  }

  return files;
};


/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://k-beauty-compass-web.vercel.app',
  generateRobotsTxt: true,
  // This function will be executed automatically when you run `next-sitemap`
  additionalPaths: async (config) => {
    const postsDirectory = path.join(process.cwd(), 'posts');
    // Get all .md file paths recursively
    const filePaths = getFilesRecursively(postsDirectory, '.md');
    
    const posts = filePaths.map((filePath) => {
      // Create a slug from the file path, e.g., posts/en/some-post.md -> /blog/en/some-post
      const slug = filePath
        .replace(postsDirectory, '')
        .replace(/\.md$/, '')
        .replace(/\\/g, '/'); // Ensure forward slashes for URL

      const fileContents = fs.readFileSync(filePath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        loc: `/blog${slug}`,
        changefreq: 'daily',
        priority: 0.7,
        lastmod: matterResult.data.date || new Date().toISOString(),
      };
    });

    return posts;
  },
};