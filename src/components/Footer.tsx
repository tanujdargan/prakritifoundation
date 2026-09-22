import React from 'react';
import { Heart, Mail, Phone, Instagram } from 'lucide-react';
import { ORG } from '../lib/organization';

const Footer = () => {
  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-pf-forest text-pf-sage">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <Heart className="h-8 w-8 text-pf-cream" aria-hidden="true" />
              <span className="font-display text-xl font-semibold tracking-tight text-pf-cream">
                Prakriti Foundation
              </span>
            </div>
            <p className="leading-relaxed mb-6">
              Creating a more compassionate world through animal welfare,
              environmental care, and community support.
            </p>
            <div className="flex gap-4">
              <a
                href={ORG.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Prakriti Foundation on Instagram"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-pf-cream/20 bg-pf-cream/10 text-pf-cream transition-colors duration-200 hover:bg-pf-moss cursor-pointer"
              >
                <Instagram className="h-5 w-5" aria-hidden="true" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-pf-cream mb-4">Quick Links</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('about')}
                  className="block text-left hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  About Us
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('services')}
                  className="block text-left hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Our Services
                </button>
                <button
                  type="button"
                  onClick={() => scrollToSection('stories')}
                  className="block text-left hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Success Stories
                </button>
              </div>
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => scrollToSection('help')}
                  className="block text-left hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  How to Help
                </button>
                <button
                  onClick={() => scrollToSection('adoption')}
                  className="block text-left hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Adoption
                </button>
                <button
                  onClick={() => scrollToSection('contact')}
                  className="block text-left hover:text-white transition-colors duration-200 cursor-pointer"
                >
                  Volunteer
                </button>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-pf-cream mb-4">Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-pf-cream" aria-hidden="true" />
                <span>{ORG.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-pf-cream" aria-hidden="true" />
                <span>{ORG.email}</span>
              </div>
              <p className="text-sm italic">
                If you find an injured or distressed animal, please contact us immediately.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-pf-cream/15 mt-12 pt-8 text-center">
          <p>© 2025 Prakriti Foundation. Made with ❤️ for a better world.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
