"use client";
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, User, LogOut } from 'lucide-react';
import { useAuth } from '../src/context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const pathname = usePathname();

  // FIXED: Added logout from useAuth context
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'HOME', path: '/' },
    { name: 'ABOUT US', path: '/about' },
    { name: 'PACKAGES', path: '/packages' },
    { name: 'CONTACT US', path: '/contact' },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      await logout(); // Now correctly calls the logout function from context
    } catch (err) {
      console.error('Logout failed:', err);
    } finally {
      setLogoutLoading(false);
      setIsOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <nav
      className={`
        fixed top-0 inset-x-0 z-50 transition-all duration-500 font-poppins
        ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-lg py-2' : 'bg-transparent pt-8'}
      `}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-end items-center h-14">

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <div
              className={`
                flex items-center p-1 rounded-full
                ${scrolled ? 'bg-black/10' : 'bg-black/50'}
              `}
            >
              {navItems.map((item) => {
                const isActive = pathname === item.path;
                return (
                  <Link
                    key={item.name}
                    href={item.path}
                    className={`
                      text-[12px] tracking-widest uppercase px-4 py-2 mx-1 rounded-full
                      transition-all duration-300 font-medium
                      ${
                        isActive
                          ? scrolled
                            ? 'bg-black text-white hover:bg-black'
                            : 'bg-white text-black hover:bg-white'
                          : scrolled
                            ? 'text-black hover:bg-black/10'
                            : 'text-white hover:bg-white/20'
                      }
                    `}
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className={`
                    text-[12px] tracking-widest uppercase px-4 py-2 rounded-full
                    transition-all duration-300 font-medium border flex items-center gap-2
                    ${scrolled
                      ? 'bg-black text-white hover:bg-gray-800 border-black'
                      : 'bg-white text-black hover:bg-gray-200 border-white'
                    }
                  `}
                >
                  <User className="w-4 h-4" />
                  {user.name || user.email.split('@')[0]}
                </button>

                {isOpen && (
                  <div className={`
                    absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-2xl p-2
                    transition-all duration-300 transform
                  `}>
                    <Link href="/profile" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg">
                      My Profile
                    </Link>
                    <Link href="/bookings" onClick={handleLinkClick} className="block px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 rounded-lg">
                      My Bookings
                    </Link>
                    <button
                      onClick={handleLogout}
                      disabled={logoutLoading}
                      className={`w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 transition-opacity ${
                        logoutLoading ? 'opacity-70 cursor-not-allowed' : ''
                      }`}
                    >
                      {logoutLoading ? (
                        <>
                          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Logging out...
                        </>
                      ) : (
                        'Logout'
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/auth"
                className={`
                  text-[12px] tracking-widest uppercase px-4 py-2 rounded-full
                  transition-all duration-300 font-medium border
                  ${scrolled
                    ? 'bg-black text-white hover:bg-gray-800 border-black'
                    : 'bg-white text-black hover:bg-gray-200 border-white'
                  }
                `}
                onClick={handleLinkClick}
              >
                LOGIN/SIGNUP
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center mr-2 md:hidden relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`
                inline-flex items-center justify-center p-2 rounded-full
                focus:outline-none transition-colors duration-200 shadow-lg
                ${scrolled
                  ? 'text-gray-800 bg-white hover:bg-gray-100'
                  : 'text-white bg-black/70 hover:bg-black/90'
                }
              `}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {isOpen && (
              <div className={`
                absolute top-full right-0 mt-3 w-48 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl p-2
                transition-opacity duration-300 transform
                ${isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible translate-y-2'}
              `}>
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.path}
                    onClick={handleLinkClick}
                    className={`
                      block text-gray-800 uppercase text-xs tracking-widest py-3 px-3 my-1
                      rounded-lg transition-colors duration-200
                      ${pathname === item.path ? 'bg-gray-200 font-semibold' : 'hover:bg-gray-100'}
                    `}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="border-t border-gray-200 pt-2 mt-2">
                  {user ? (
                    <>
                      <div className="px-3 py-2 text-xs text-gray-600 truncate">
                        {user.name || user.email.split('@')[0]}
                      </div>
                      <Link href="/profile" onClick={handleLinkClick} className="block px-3 py-2 text-xs text-gray-800 hover:bg-gray-100 rounded-lg">
                        My Profile
                      </Link>
                      <Link href="/bookings" onClick={handleLinkClick} className="block px-3 py-2 text-xs text-gray-800 hover:bg-gray-100 rounded-lg">
                        My Bookings
                      </Link>
                      <button
                        onClick={handleLogout}
                        disabled={logoutLoading}
                        className={`w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 ${
                          logoutLoading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {logoutLoading ? (
                          <>
                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Logging out...
                          </>
                        ) : (
                          'Logout'
                        )}
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/auth"
                      onClick={handleLinkClick}
                      className={`
                        block text-white uppercase text-xs tracking-widest py-3 px-3 my-1
                        rounded-lg transition-colors duration-200 bg-black hover:bg-gray-800 font-semibold
                      `}
                    >
                      LOGIN/SIGNUP
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;