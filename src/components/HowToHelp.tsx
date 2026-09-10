import React from 'react';
import { Users, Home, IndianRupee, Receipt, Award } from 'lucide-react';
import DonationReceipt from './DonationReceipt';
import VolunteerCertificate from './VolunteerCertificate';

const HowToHelp = () => {
  const [showReceiptModal, setShowReceiptModal] = React.useState(false);
  const [showCertificateModal, setShowCertificateModal] = React.useState(false);

  const helpOptions = [
    {
      icon: IndianRupee,
      title: "Make a Donation",
      description: "Your financial support helps us provide food, medical care, and shelter for animals in need.",
      action: "Donate Now",
      details: [
        "₹500 - Feeds 10 animals for a week",
        "₹1000 - Covers basic medical treatment",
        "₹2500 - Supports one rescue operation",
        "₹5000 - Sponsors a full rehabilitation"
      ]
    },
    {
      icon: Users,
      title: "Volunteer With Us",
      description: "Join our team of passionate volunteers and make a direct impact in animal rescue and care.",
      action: "Volunteer",
      details: [
        "Rescue operations and transport",
        "Animal care and feeding",
        "Adoption events coordination",
        "Social media and awareness campaigns"
      ]
    },
    {
      icon: Home,
      title: "Adopt a Friend",
      description: "Give a rescued animal a loving forever home and experience the joy of unconditional love.",
      action: "See Adoptable Pets",
      details: [
        "All animals are vaccinated and healthy",
        "Free post-adoption support",
        "Home visits for perfect matching",
        "Lifetime support and guidance"
      ]
    }
  ];

  return (
    <section id="help" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-pf-ink mb-6">
            How You Can Help
          </h2>
          <p className="text-xl text-pf-muted max-w-3xl mx-auto">
            There are many ways to make a difference. Whether through donations, volunteering,
            or adoption, every contribution helps us save more lives.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {helpOptions.map((option, index) => (
            <div
              key={index}
              className="rounded-lg border border-pf-border bg-white p-6 text-center transition-colors duration-200 hover:border-pf-moss hover:bg-pf-sage/40"
            >
              <div className="w-16 h-16 rounded-full bg-pf-sage flex items-center justify-center mx-auto mb-4">
                <option.icon className="h-8 w-8 text-pf-forest" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold text-pf-ink mb-3">
                {option.title}
              </h3>
              <p className="text-pf-muted mb-6">
                {option.description}
              </p>

              <div className="space-y-2 mb-6 text-left">
                {option.details.map((detail, detailIndex) => (
                  <div key={detailIndex} className="flex items-center text-sm text-pf-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-pf-moss mr-3 flex-shrink-0" aria-hidden="true" />
                    {detail}
                  </div>
                ))}
              </div>

              <button className="w-full bg-pf-marigold text-white px-6 py-3 rounded-md font-semibold">
                {option.action}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-lg border border-pf-border p-8 text-center">
          <Receipt className="h-12 w-12 text-pf-marigold mx-auto mb-4" aria-hidden="true" />
          <h3 className="text-2xl font-semibold text-pf-ink mb-4">
            Generate Donation Receipt
          </h3>
          <p className="text-pf-muted mb-6 max-w-2xl mx-auto">
            For donors who have already made a contribution, generate an official receipt
            for tax purposes and record keeping.
          </p>
          <button
            type="button"
            onClick={() => setShowReceiptModal(true)}
            className="bg-pf-marigold hover:bg-pf-forest text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 flex items-center mx-auto cursor-pointer"
          >
            <Receipt className="h-5 w-5 mr-2" aria-hidden="true" />
            Generate Receipt
          </button>
        </div>

        <div className="mt-6 bg-pf-cream rounded-lg border border-pf-border p-6 text-center">
          <Award className="h-8 w-8 text-pf-muted mx-auto mb-3" aria-hidden="true" />
          <h3 className="text-lg font-semibold text-pf-ink mb-2">
            Admin Dashboard
          </h3>
          <p className="text-sm text-pf-muted mb-4 max-w-2xl mx-auto">
            Access the admin dashboard to generate volunteer certificates, manage donations,
            and handle administrative tasks.
          </p>
          <a
            href="/admin"
            className="inline-flex items-center border border-pf-border text-pf-muted px-5 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 hover:border-pf-forest hover:text-pf-forest cursor-pointer"
          >
            <Award className="h-4 w-4 mr-2" aria-hidden="true" />
            Access Admin Dashboard
          </a>
        </div>

        <div className="mt-16 bg-pf-forest rounded-lg p-8 text-center">
          <h3 className="text-2xl font-semibold mb-4 text-white">
            Every Contribution Matters
          </h3>
          <p className="text-lg text-pf-sage mb-6 max-w-2xl mx-auto">
            Whether you donate ₹50 or ₹5000, volunteer an hour or a day, every act of kindness
            brings us closer to our goal of creating a more compassionate world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-pf-cream/10 border border-pf-cream/20 rounded-md px-4 py-2">
              <span className="text-sm text-pf-cream">Contact us for payment details</span>
            </div>
            <div className="bg-pf-cream/10 border border-pf-cream/20 rounded-md px-4 py-2">
              <span className="text-sm text-pf-cream">UPI ID coming soon</span>
            </div>
          </div>
        </div>
      </div>

      <DonationReceipt
        isOpen={showReceiptModal}
        onClose={() => setShowReceiptModal(false)}
      />

      <VolunteerCertificate
        isOpen={showCertificateModal}
      />
    </section>
  );
};

export default HowToHelp;
