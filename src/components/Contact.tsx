import React from 'react';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';
import { ORG } from '../lib/organization';

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-pf-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-pf-ink mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-pf-muted max-w-3xl mx-auto">
            Ready to make a difference? Contact us to learn more about volunteering,
            adoption, or supporting our mission.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold text-pf-ink mb-8">
              Contact Information
            </h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="bg-pf-sage w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Mail className="h-6 w-6 text-pf-forest" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-pf-ink mb-1">Email</h4>
                  <p className="text-pf-muted">{ORG.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pf-sage w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <Phone className="h-6 w-6 text-pf-forest" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-pf-ink mb-1">Phone</h4>
                  <p className="text-pf-muted">{ORG.phone}</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="bg-pf-sage w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-6 w-6 text-pf-forest" aria-hidden="true" />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-pf-ink mb-1">Shelter Location</h4>
                  <p className="text-pf-muted">
                    {ORG.address.line1}<br />
                    {ORG.address.line2}<br />
                    {ORG.address.line3}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h4 className="text-lg font-semibold text-pf-ink mb-4">
                Follow Our Journey
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  aria-label="Facebook"
                  className="bg-pf-forest hover:bg-pf-moss w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <Facebook className="h-6 w-6 text-white" aria-hidden="true" />
                </a>
                <a
                  href="#"
                  aria-label="Instagram"
                  className="bg-pf-forest hover:bg-pf-moss w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <Instagram className="h-6 w-6 text-white" aria-hidden="true" />
                </a>
                <a
                  href="#"
                  aria-label="Twitter"
                  className="bg-pf-forest hover:bg-pf-moss w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200 cursor-pointer"
                >
                  <Twitter className="h-6 w-6 text-white" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-pf-border p-8">
            <h3 className="text-2xl font-semibold text-pf-ink mb-6">
              Quick Contact
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="contact-first-name" className="block text-sm font-medium text-pf-ink mb-2">
                    First Name
                  </label>
                  <input
                    id="contact-first-name"
                    type="text"
                    className="w-full min-h-[44px] px-4 py-3 border border-pf-border rounded-md transition-colors duration-200 focus:outline-none focus:border-pf-moss"
                    placeholder="Enter your first name"
                  />
                </div>
                <div>
                  <label htmlFor="contact-last-name" className="block text-sm font-medium text-pf-ink mb-2">
                    Last Name
                  </label>
                  <input
                    id="contact-last-name"
                    type="text"
                    className="w-full min-h-[44px] px-4 py-3 border border-pf-border rounded-md transition-colors duration-200 focus:outline-none focus:border-pf-moss"
                    placeholder="Enter your last name"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-sm font-medium text-pf-ink mb-2">
                  Email Address
                </label>
                <input
                  id="contact-email"
                  type="email"
                  className="w-full min-h-[44px] px-4 py-3 border border-pf-border rounded-md transition-colors duration-200 focus:outline-none focus:border-pf-moss"
                  placeholder="your.email@example.com"
                />
              </div>

              <div>
                <label htmlFor="contact-reason" className="block text-sm font-medium text-pf-ink mb-2">
                  How can we help you?
                </label>
                <select
                  id="contact-reason"
                  className="w-full min-h-[44px] px-4 py-3 border border-pf-border rounded-md transition-colors duration-200 focus:outline-none focus:border-pf-moss"
                >
                  <option>I want to adopt a pet</option>
                  <option>I want to volunteer</option>
                  <option>I want to make a donation</option>
                  <option>I found an animal that needs help</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="contact-message" className="block text-sm font-medium text-pf-ink mb-2">
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={4}
                  className="w-full px-4 py-3 border border-pf-border rounded-md transition-colors duration-200 focus:outline-none focus:border-pf-moss resize-none"
                  placeholder="Tell us more about how you'd like to help or what you need..."
                />
              </div>

              <button
                type="button"
                className="w-full bg-pf-forest hover:bg-pf-moss text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 cursor-pointer"
              >
                Send Message
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
