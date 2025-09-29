import React from 'react';
import { Heart, Users, Home, IndianRupee, Receipt, Award } from 'lucide-react';
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
      color: "blue",
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
      color: "green",
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
      color: "orange",
      details: [
        "All animals are vaccinated and healthy",
        "Free post-adoption support",
        "Home visits for perfect matching",
        "Lifetime support and guidance"
      ]
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-600 hover:bg-blue-700",
      light: "bg-blue-50",
      icon: "text-blue-600",
      border: "border-blue-200"
    },
    green: {
      bg: "bg-green-600 hover:bg-green-700",
      light: "bg-green-50",
      icon: "text-green-600",
      border: "border-green-200"
    },
    orange: {
      bg: "bg-orange-600 hover:bg-orange-700",
      light: "bg-orange-50",
      icon: "text-orange-600",
      border: "border-orange-200"
    }
  };

  return (
    <section id="help" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            How You Can Help
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            There are many ways to make a difference. Whether through donations, volunteering, 
            or adoption, every contribution helps us save more lives.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {helpOptions.map((option, index) => (
            <div 
              key={index}
              className={`rounded-xl overflow-hidden shadow-lg transform hover:scale-105 transition-all duration-300 border-2 ${colorClasses[option.color].border}`}
            >
              <div className={`${colorClasses[option.color].light} p-6 text-center`}>
                <div className={`w-16 h-16 rounded-full bg-white flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  <option.icon className={`h-8 w-8 ${colorClasses[option.color].icon}`} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {option.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {option.description}
                </p>
                
                <div className="space-y-2 mb-6">
                  {option.details.map((detail, detailIndex) => (
                    <div key={detailIndex} className="flex items-center text-sm text-gray-600">
                      <div className={`w-2 h-2 rounded-full ${colorClasses[option.color].bg} mr-3`} />
                      {detail}
                    </div>
                  ))}
                </div>
                
                <button className={`w-full ${colorClasses[option.color].bg} text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105`}>
                  {option.action}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <Receipt className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Generate Donation Receipt
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            For donors who have already made a contribution, generate an official receipt 
            for tax purposes and record keeping.
          </p>
          <button 
            onClick={() => setShowReceiptModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center mx-auto"
          >
            <Receipt className="h-5 w-5 mr-2" />
            Generate Receipt
          </button>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-8 text-center">
          <Award className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Access the admin dashboard to generate volunteer certificates, manage donations, 
            and handle administrative tasks.
          </p>
          <a 
            href="/admin"
            className="inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Award className="h-5 w-5 mr-2" />
            Access Admin Dashboard
          </a>
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Every Contribution Matters
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-2xl mx-auto">
            Whether you donate ₹50 or ₹5000, volunteer an hour or a day, every act of kindness 
            brings us closer to our goal of creating a more compassionate world.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2">
              <span className="text-sm">Contact us for payment details</span>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-lg px-4 py-2">
              <span className="text-sm">UPI ID coming soon</span>
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