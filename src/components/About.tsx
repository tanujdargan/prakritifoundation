import React from 'react';
import { Heart, Leaf, Users, Shield } from 'lucide-react';

const About = () => {
  return (
    <section id="about" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            About CompassionCare
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We are a humanitarian organization dedicated to creating positive change in our world. 
            Starting with animal welfare, we're expanding our mission to address environmental challenges 
            and support underprivileged communities and senior citizens.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Mission</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">
              CompassionCare was founded with a simple belief: every living being deserves love, care, and dignity. 
              What started as a passion for rescuing and rehabilitating stray dogs has grown into a comprehensive 
              humanitarian mission.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Today, we continue our vital animal welfare work while preparing to expand into environmental 
              conservation, supporting underprivileged communities, and caring for our elderly. 
              Our holistic approach recognizes that true compassion knows no boundaries.
            </p>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Volunteers helping animals"
              className="rounded-lg shadow-xl w-full h-80 object-cover"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Heart className="h-8 w-8 text-blue-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Animal Welfare</h4>
            <p className="text-gray-600">
              Rescuing, treating, and finding loving homes for stray and abandoned animals.
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <Leaf className="h-8 w-8 text-green-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Environmental Care</h4>
            <p className="text-gray-600">
              Future initiatives to protect our environment and promote sustainable living.
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
              <Users className="h-8 w-8 text-orange-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Community Support</h4>
            <p className="text-gray-600">
              Planned programs to support underprivileged families and communities in need.
            </p>
          </div>

          <div className="text-center group">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Shield className="h-8 w-8 text-purple-600" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 mb-3">Senior Care</h4>
            <p className="text-gray-600">
              Future services to provide support and companionship for elderly community members.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;