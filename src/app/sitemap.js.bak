import { getSortedPostsData } from '@/lib/posts'; // Adjust path if necessary

// This function will be called by Next.js to generate the sitemap
export default async function sitemap() {
  const siteUrl = 'https://k-beauty-compass-web.vercel.app'; // Your site's base URL

  const allPostsDataEn = getSortedPostsData('en');
  const allPostsDataKo = getSortedPostsData('ko');

  const postsByBaseName = {};

  allPostsDataEn.forEach(post => {
    postsByBaseName[post.id] = { en: post };
  });

  allPostsDataKo.forEach(post => {
    if (!postsByBaseName[post.id]) {
      postsByBaseName[post.id] = {};
    }
    postsByBaseName[post.id].ko = post;
  });

  const sitemapItems = Object.entries(postsByBaseName).flatMap(([baseName, langFiles]) => {
    const entries = [];
    
    let latestLastMod = new Date(); // Default to current date
    if (langFiles.en && langFiles.en.date) {
        const enDate = new Date(langFiles.en.date);
        if (!isNaN(enDate.getTime())) { // Check if date is valid
            latestLastMod = enDate;
        }
    } else if (langFiles.ko && langFiles.ko.date) {
        const koDate = new Date(langFiles.ko.date);
        if (!isNaN(koDate.getTime())) { // Check if date is valid
            latestLastMod = koDate;
        }
    }

    const alternates = {};
    if (langFiles.en) alternates.en = `${siteUrl}/en/blog/${baseName}`;
    if (langFiles.ko) alternates.ko = `${siteUrl}/ko/blog/${baseName}`;

    if (langFiles.en) {
      entries.push({
        url: `${siteUrl}/en/blog/${baseName}`,
        lastModified: latestLastMod.toISOString(),
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: alternates,
        },
      });
    }
    if (langFiles.ko) {
      entries.push({
        url: `${siteUrl}/ko/blog/${baseName}`,
        lastModified: latestLastMod.toISOString(),
        changeFrequency: 'daily',
        priority: 0.7,
        alternates: {
          languages: alternates,
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
