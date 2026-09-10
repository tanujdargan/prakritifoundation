import React, { useState, useEffect } from 'react';
import { Menu, X, Heart } from 'lucide-react';

const NAV_ITEMS = ['home', 'about', 'services', 'stories', 'adoption', 'help', 'contact'];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 border-b transition-colors duration-300 ${
        isScrolled ? 'bg-pf-cream border-pf-border' : 'bg-transparent border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center gap-2">
            <Heart
              className={`h-7 w-7 transition-colors duration-300 ${
                isScrolled ? 'text-pf-forest' : 'text-white'
              }`}
              aria-hidden="true"
            />
            <span
              className={`font-display text-2xl font-semibold tracking-tight transition-colors duration-300 ${
                isScrolled ? 'text-pf-forest' : 'text-white'
              }`}
            >
              Prakriti Foundation
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => scrollToSection(item)}
                className={`cursor-pointer text-sm font-medium transition-colors duration-300 ${
                  isScrolled
                    ? 'text-pf-ink hover:text-pf-moss'
                    : 'text-white hover:text-pf-sage'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className={`md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md cursor-pointer transition-colors duration-300 ${
              isScrolled ? 'text-pf-forest' : 'text-white'
            }`}
            onClick={() => setIsMenuOpen((open) => !open)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          id="mobile-nav"
          className={`md:hidden overflow-hidden transition-all duration-200 ease-out ${
            isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <nav className="bg-pf-cream border-t border-pf-border py-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => scrollToSection(item)}
                className="block w-full text-left px-2 py-3 text-pf-ink hover:text-pf-moss transition-colors duration-200 cursor-pointer"
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
