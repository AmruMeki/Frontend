import { Link } from 'react-router';
import { ThemeToggleButton } from '../components/common/ThemeToggleButton';
import { useEffect, useState } from 'react';

export default function PublicHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const linkClass = scrolled
    ? 'text-sm font-medium text-gray-700 hover:text-gray-900'
    : 'text-sm font-medium text-white hover:text-gray-100';

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
        scrolled
          ? 'backdrop-blur-sm bg-white/70 border-b dark:bg-gray-900/70 dark:border-gray-800'
          : 'bg-transparent border-0'
      }`}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2">
            <img
              src="./images/logo/logo.svg"
              alt="Logo"
              className="h-8 dark:hidden"
            />
            <img
              src="./images/logo/logo-dark.svg"
              alt="Logo"
              className="h-8 hidden dark:block"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link to="/" className={linkClass}>
              Home
            </Link>
            <Link to="/blog" className={linkClass}>
              Blog
            </Link>
            <Link to="/contact" className={linkClass}>
              Contact Us
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggleButton />
          <Link
            to="/signin"
            className="px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded hover:bg-indigo-700"
          >
            Login
          </Link>
        </div>
      </div>
    </header>
  );
}
