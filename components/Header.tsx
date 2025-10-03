
import React, { useState } from 'react';
import { YouTubeIcon } from './IconComponents';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Features', href: '#features' },
    { name: 'Tools', href: '#tools' },
    { name: 'Pricing', href: '#pricing' },
    { name: 'Affiliate', href: '#affiliate' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-secondary">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <YouTubeIcon className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold text-text-main">YT Pro Tools</span>
          </div>
          
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a key={link.name} href={link.href} className="text-text-secondary hover:text-text-main transition-colors duration-300">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <button className="text-text-secondary hover:text-text-main transition-colors duration-300">
              Đăng nhập
            </button>
            <button className="bg-primary hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-transform duration-300 hover:scale-105">
              Đăng ký miễn phí
            </button>
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
                <a key={link.name} href={link.href} className="text-text-secondary hover:text-text-main transition-colors duration-300">
                  {link.name}
                </a>
              ))}
            </nav>
            <div className="flex flex-col space-y-4 mt-6">
              <button className="text-text-secondary hover:text-text-main transition-colors duration-300 text-left">
                Đăng nhập
              </button>
              <button className="bg-primary hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-lg transition-transform duration-300 hover:scale-105">
                Đăng ký miễn phí
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
