import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "K-Beauty Compass",
  description: "Find your perfect K-Beauty products with personalized recommendations.",
  keywords: "K-Beauty, Korean Skincare, Skincare Recommendations, Personalized Skincare, Beauty Compass",
  openGraph: {
    title: "K-Beauty Compass",
    description: "Find your perfect K-Beauty products with personalized recommendations.",
    url: "https://k-beauty-compass.com", // TODO: Replace with actual domain
    siteName: "K-Beauty Compass",
    images: [
      {
        url: "https://k-beauty-compass.com/og-image.jpg", // TODO: Create an OG image
        width: 1200,
        height: 630,
        alt: "K-Beauty Compass - Personalized Skincare Recommendations",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "K-Beauty Compass",
    description: "Find your perfect K-Beauty products with personalized recommendations.",
    images: ["https://k-beauty-compass.com/twitter-image.jpg"], // TODO: Create a Twitter image
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-YOUR_ADSENSE_PUBLISHER_ID"
          crossOrigin="anonymous"></script>
      </head>
      <body>{children}</body>
    </html>
  );
}
