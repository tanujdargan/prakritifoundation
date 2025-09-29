import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const SuccessStories = () => {
  const stories = [
    {
      name: "Bella's Second Chance",
      location: "Mumbai",
      date: "December 2024",
      before: "https://images.pexels.com/photos/1346086/pexels-photo-1346086.jpeg?auto=compress&cs=tinysrgb&w=400",
      after: "https://images.pexels.com/photos/1851164/pexels-photo-1851164.jpeg?auto=compress&cs=tinysrgb&w=400",
      story: "Found injured on the streets with a broken leg, Bella underwent surgery and months of rehabilitation. Today, she's living happily with the Kumar family, running and playing in their garden."
    },
    {
      name: "Max's Transformation",
      location: "Delhi",
      date: "November 2024",
      before: "https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=400",
      after: "https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=400",
      story: "Max was rescued from severe neglect, malnourished and fearful. After months of love, proper nutrition, and care, he's now a confident, healthy dog who brings joy to his new family every day."
    },
    {
      name: "Luna's Journey Home",
      location: "Bangalore",
      date: "October 2024",
      before: "https://images.pexels.com/photos/1346504/pexels-photo-1346504.jpeg?auto=compress&cs=tinysrgb&w=400",
      after: "https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=400",
      story: "Luna was found as a tiny puppy in a construction site. Through our adoption program, she found a loving home where she's grown into a beautiful, well-trained companion."
    }
  ];

  return (
    <section id="stories" className="py-20 bg-gradient-to-b from-blue-50 to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every rescue tells a story of hope, healing, and new beginnings. 
            Here are just a few of the lives we've been able to transform together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {stories.map((story, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
            >
              <div className="grid grid-cols-2 h-48">
                <div className="relative">
                  <img 
                    src={story.before}
                    alt={`${story.name} before rescue`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    Before
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={story.after}
                    alt={`${story.name} after rescue`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded text-xs font-semibold">
                    After
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {story.name}
                </h3>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{story.date}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 leading-relaxed">
                  {story.story}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            Want to be part of the next success story?
          </p>
          <button 
            onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            Get Involved
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;