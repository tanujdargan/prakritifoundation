import React from 'react';
import { Stethoscope, Home, Heart, Truck } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Truck,
      title: "Emergency Rescue",
      description: "24/7 emergency response team for animals in distress, providing immediate care and safety.",
      image: "https://images.pexels.com/photos/1076758/pexels-photo-1076758.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: Stethoscope,
      title: "Medical Treatment",
      description: "Comprehensive veterinary care including surgeries, vaccinations, and rehabilitation.",
      image: "https://images.pexels.com/photos/6235232/pexels-photo-6235232.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: Home,
      title: "Adoption Program",
      description: "Careful matching process to find perfect forever homes for our rescued animals.",
      image: "https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400"
    },
    {
      icon: Heart,
      title: "Rehabilitation",
      description: "Long-term care and behavioral therapy to help traumatized animals heal and trust again.",
      image: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Services
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From emergency rescue to finding forever homes, we provide comprehensive care 
            for animals throughout their journey to safety and happiness.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-48 overflow-hidden">
                <img 
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <service.icon className="h-8 w-8 text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;