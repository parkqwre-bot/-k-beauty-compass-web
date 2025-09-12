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
      <Link href={`/${lang}`} style={logoStyle}>
        K-Beauty Compass
      </Link>
      <nav>
        <Link href={`/${lang}`} style={navLinkStyle}>
          Home
        </Link>
        <Link href={`/${lang}/blog`} style={navLinkStyle}>
          Blog
        </Link>
      </nav>
    </header>
  );
}
