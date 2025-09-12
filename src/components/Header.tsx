'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  // Get lang from URL (e.g., /en/blog -> en), default to 'en' if not present
  const lang = pathname.split('/')[1] || 'en';

  const headerStyle: React.CSSProperties = {
    backgroundColor: '#2c3e50',
    padding: '1rem 2rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: 'white',
  };

  const navLinkStyle: React.CSSProperties = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 1rem',
    fontSize: '1.1rem',
  };

  const logoStyle: React.CSSProperties = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none',
  };

  return (
    <header style={headerStyle}>
      <Link href={`/`} style={logoStyle}>
        K-Beauty Compass
      </Link>
      <nav style={{ display: 'flex', alignItems: 'center' }}>
        <Link href={`/`} style={navLinkStyle}>
          Home
        </Link>
        <Link href={`/${lang}/blog`} style={navLinkStyle}>
          Blog
        </Link>
        <select
          onChange={(e) => {
            const newLang = e.target.value;
            let newPath = pathname;

            if (newPath === '/') {
              newPath = `/${newLang}/blog`; // Redirect to the blog of the selected language
            } else {
              newPath = pathname.replace(/^\/(en|ko)/, `/${newLang}`);
            }
            window.location.href = newPath;
          }}
          value={lang}
          className="p-2 rounded-md border bg-gray-700 text-white ml-4"
        >
          <option value="en">English</option>
          <option value="ko">한국어</option>
        </select>
      </nav>
    </header>
  );
}
