import React from 'react';
import { MapPin, Navigation, Clock } from 'lucide-react';

const GoogleMaps = () => {
  const address = "123 Compassion Street, Animal Welfare District, Mumbai - 400001, Maharashtra, India";
  const coordinates = "19.0760,72.8777"; // Mumbai coordinates - replace with actual location

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    window.open(url, '_blank');
  };

  const getDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${coordinates}`;
    window.open(url, '_blank');
  };

  return (
    <section id="location" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Visit Our Location
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Come visit our shelter and see the amazing work we do. We welcome visitors, volunteers, and potential adopters.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Map Embed */}
          <div className="relative">
            <div className="bg-gray-200 rounded-xl overflow-hidden shadow-lg h-96">
              <iframe
                src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3771.2!2d72.8777!3d19.0760!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTnCsDA0JzMzLjYiTiA3MsKwNTInMzkuNyJF!5e0!3m2!1sen!2sin!4v1234567890`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Prakriti Foundation Location"
              />
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
              <div className="flex items-start space-x-4">
                <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Our Address</h3>
                  <p className="text-gray-600 leading-relaxed">{address}</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-xl border border-green-200">
              <div className="flex items-start space-x-4">
                <Clock className="h-6 w-6 text-green-600 mt-1" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Visiting Hours</h3>
                  <div className="space-y-1 text-gray-600">
                    <p><strong>Monday - Friday:</strong> 9:00 AM - 6:00 PM</p>
                    <p><strong>Saturday:</strong> 9:00 AM - 4:00 PM</p>
                    <p><strong>Sunday:</strong> 10:00 AM - 3:00 PM</p>
                    <p className="text-sm text-green-700 mt-2">
                      <strong>Emergency:</strong> 24/7 rescue services available
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <button
                onClick={openInGoogleMaps}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <MapPin className="h-5 w-5 mr-2" />
                View on Google Maps
              </button>

              <button
                onClick={getDirections}
                className="w-full bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center"
              >
                <Navigation className="h-5 w-5 mr-2" />
                Get Directions
              </button>
            </div>

            <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-900 mb-2">Before You Visit</h4>
              <ul className="text-sm text-orange-800 space-y-1">
                <li>• Please call ahead for adoption appointments</li>
                <li>• Bring valid ID for volunteer registration</li>
                <li>• Donations of food and supplies always welcome</li>
                <li>• Photography allowed with permission</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GoogleMaps;