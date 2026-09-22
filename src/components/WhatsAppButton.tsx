import { ORG } from '../lib/organization';
import React from 'react';
import { MessageCircle, Phone } from 'lucide-react';

const WhatsAppButton = () => {
  const phoneNumber = ORG.phoneE164;
  const message = "Hello! I'm interested in learning more about Prakriti Foundation and how I can help.";

  const openWhatsApp = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const makeCall = () => {
    window.open(`tel:+${phoneNumber}`, '_self');
  };

  return (
    <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-3">
      {/* WhatsApp Button */}
      <button
        type="button"
        onClick={openWhatsApp}
        aria-label="Chat on WhatsApp"
        title="Chat on WhatsApp"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-pf-moss text-white transition-colors duration-200 hover:bg-pf-forest cursor-pointer group"
      >
        <MessageCircle className="h-6 w-6" aria-hidden="true" />
        <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-pf-forest text-pf-cream px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat on WhatsApp
        </span>
      </button>

      {/* Call Button */}
      <button
        type="button"
        onClick={makeCall}
        aria-label="Call us"
        title="Call us"
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-pf-forest text-white transition-colors duration-200 hover:bg-pf-moss cursor-pointer group"
      >
        <Phone className="h-6 w-6" aria-hidden="true" />
        <span className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-pf-forest text-pf-cream px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Call us now
        </span>
      </button>
    </div>
  );
};

export default WhatsAppButton;
