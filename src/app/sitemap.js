export default async function sitemap() {
  return [
    {
      url: 'https://k-beauty-compass-web.vercel.app',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://k-beauty-compass-web.vercel.app/en',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://k-beauty-compass-web.vercel.app/ko',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
  ]
}