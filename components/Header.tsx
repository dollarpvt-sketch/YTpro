import React, { useState } from 'react';
import { YouTubeIcon } from './IconComponents';
import { useAuth } from '../contexts/AuthContext';
import ProfileDropdown from './ProfileDropdown';
import CustomGoogleSignInButton from './CustomGoogleSignInButton';

interface HeaderProps {
  onGoHome: () => void;
}

const Header: React.FC<HeaderProps> = ({ onGoHome }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();

  const navLinks = [
    { name: 'Công Cụ', href: '#tools' },
    { name: 'Đánh Giá', href: '#testimonials' },
    { name: 'Giá', href: '#pricing' },
    { name: 'Affiliate', href: '#affiliate' },
  ];

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    onGoHome(); // Ensure we are on the home page before scrolling
    
    // Use a timeout to allow the state to update and the main page to render
    setTimeout(() => {
      const targetId = e.currentTarget.getAttribute('href')?.substring(1);
      if (targetId) {
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }, 0);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-secondary">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button onClick={onGoHome} className="flex items-center space-x-2 cursor-pointer">
            <YouTubeIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-text-main">YT Pro Tools</span>
          </button>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} onClick={handleNavClick} className="text-text-secondary hover:text-text-main transition-colors duration-300 text-sm">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center">
            {user ? (
              <ProfileDropdown />
            ) : (
              <CustomGoogleSignInButton>
                Đăng nhập / Đăng ký
              </CustomGoogleSignInButton>
            )}
          </div>

          <div className="md:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-text-main">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
              </svg>
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4">
            <nav className="flex flex-col space-y-4">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href} onClick={(e) => { handleNavClick(e); setIsMenuOpen(false); }} className="text-text-secondary hover:text-text-main transition-colors duration-300">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col items-center space-y-4 mt-6">
             {user ? (
                <ProfileDropdown />
             ) : (
                <CustomGoogleSignInButton className="w-full justify-center py-3">
                  Đăng nhập với Google
                </CustomGoogleSignInButton>
             )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
