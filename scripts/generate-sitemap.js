const fs = require('fs');
const path = require('path');

const getFilesRecursively = (dir, ext, files = []) => {
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

async function generateSitemap() {
  const siteUrl = 'https://k-beauty-compass-web.vercel.app';
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

  const sitemapEntries = Object.entries(postsByBaseName).flatMap(([baseName, langFiles]) => {
    const alternateRefs = [];
    if (langFiles.en) alternateRefs.push({ lang: 'en', slug: baseName });
    if (langFiles.ko) alternateRefs.push({ lang: 'ko', slug: baseName });

    const entries = [];
    if (langFiles.en) {
      entries.push({
        loc: `${siteUrl}/en/blog/${baseName}`,
        lastmod: new Date().toISOString(),
        alternates: alternateRefs,
      });
    }
    if (langFiles.ko) {
      entries.push({
        loc: `${siteUrl}/ko/blog/${baseName}`,
        lastmod: new Date().toISOString(),
        alternates: alternateRefs,
      });
    }
    return entries;
  });

  const xmlParts = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  ];

  // Add home page
  xmlParts.push(`
  <url>
    <loc>${siteUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <xhtml:link rel="alternate" hreflang="en" href="${siteUrl}/en" />
    <xhtml:link rel="alternate" hreflang="ko" href="${siteUrl}/ko" />
  </url>`);


  sitemapEntries.forEach(entry => {
    xmlParts.push('  <url>');
    xmlParts.push(`    <loc>${entry.loc}</loc>`);
    xmlParts.push(`    <lastmod>${entry.lastmod}</lastmod>`);
    entry.alternates.forEach(alt => {
      xmlParts.push(`    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${siteUrl}/${alt.lang}/blog/${alt.slug}" />`);
    });
    xmlParts.push('  </url>');
  });

  xmlParts.push('</urlset>');

  const sitemap = xmlParts.join('\n');

  fs.writeFileSync(path.join(process.cwd(), 'public', 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);
