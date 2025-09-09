const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://k-beauty-compass-web.vercel.app',
  generateRobotsTxt: true,
  // This function will be executed automatically when you run `next-sitemap`
  additionalPaths: async (config) => {
    const postsDirectory = path.join(process.cwd(), 'posts');
    const fileNames = fs.readdirSync(postsDirectory);
    
    const posts = fileNames.map((fileName) => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      return {
        loc: `/blog/${id}`, // Pathname
        changefreq: 'daily',
        priority: 0.7,
        lastmod: matterResult.data.date || new Date().toISOString(),
      };
    });

    return posts;
  },
};