import React from 'react';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';

const Hero = () => {
  const scrollToHelp = () => {
    document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section 
      id="home" 
      className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-700 relative overflow-hidden"
    >
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="min-h-screen flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 items-center w-full">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Every Life Deserves
                <span className="text-blue-300 block">Love & Care</span>
              </h1>
              
              <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                Join us in our mission to rescue, rehabilitate, and rehome animals in need. 
                Together, we're building a compassionate world where every creature gets a second chance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <button 
                  onClick={scrollToHelp}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg"
                >
                  <Heart className="h-5 w-5" />
                  <span>Make a Difference</span>
                  <ArrowRight className="h-5 w-5" />
                </button>
                
                <button 
                  onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
                  className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                >
                  See Our Impact
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 lg:gap-8">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white transform hover:scale-105 transition-all duration-300">
                <Shield className="h-12 w-12 text-blue-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">500+</h3>
                <p className="text-blue-100">Animals Rescued</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white transform hover:scale-105 transition-all duration-300">
                <Heart className="h-12 w-12 text-green-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">300+</h3>
                <p className="text-blue-100">Successful Adoptions</p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 text-center text-white transform hover:scale-105 transition-all duration-300">
                <Users className="h-12 w-12 text-orange-300 mx-auto mb-4" />
                <h3 className="text-2xl font-bold mb-2">150+</h3>
                <p className="text-blue-100">Active Volunteers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;