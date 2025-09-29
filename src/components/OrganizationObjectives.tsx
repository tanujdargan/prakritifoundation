import React from 'react';
import { Target, Heart, Leaf, Users, Shield, Globe } from 'lucide-react';

const OrganizationObjectives = () => {
  const objectives = [
    {
      icon: Heart,
      title: "Animal Welfare & Rescue",
      description: "Rescue, rehabilitate, and rehome stray and abandoned animals while providing comprehensive medical care and shelter.",
      goals: [
        "Rescue 1000+ animals annually",
        "Achieve 90% successful adoption rate",
        "Establish mobile veterinary clinics",
        "Create awareness about animal rights"
      ],
      color: "blue"
    },
    {
      icon: Leaf,
      title: "Environmental Conservation",
      description: "Protect and preserve our environment through sustainable practices and community education programs.",
      goals: [
        "Plant 10,000 trees annually",
        "Organize monthly cleanup drives",
        "Promote renewable energy adoption",
        "Educate communities on sustainability"
      ],
      color: "green"
    },
    {
      icon: Users,
      title: "Community Development",
      description: "Support underprivileged communities through education, healthcare, and livelihood programs.",
      goals: [
        "Support 500+ families annually",
        "Provide educational scholarships",
        "Organize health camps",
        "Create employment opportunities"
      ],
      color: "orange"
    },
    {
      icon: Shield,
      title: "Senior Citizen Care",
      description: "Provide comprehensive care and support services for elderly community members.",
      goals: [
        "Establish senior care centers",
        "Provide home care services",
        "Organize recreational activities",
        "Ensure healthcare access"
      ],
      color: "purple"
    },
    {
      icon: Globe,
      title: "Global Humanitarian Aid",
      description: "Extend our compassionate mission to provide aid during natural disasters and emergencies.",
      goals: [
        "Rapid disaster response team",
        "Emergency relief supplies",
        "Rehabilitation programs",
        "International partnerships"
      ],
      color: "red"
    },
    {
      icon: Target,
      title: "Sustainable Growth",
      description: "Build a sustainable organization that can expand its impact while maintaining quality services.",
      goals: [
        "Achieve financial sustainability",
        "Expand to 5 cities by 2030",
        "Train 1000+ volunteers",
        "Establish research programs"
      ],
      color: "indigo"
    }
  ];

  const colorClasses = {
    blue: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: "text-blue-600",
      accent: "bg-blue-600"
    },
    green: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: "text-green-600",
      accent: "bg-green-600"
    },
    orange: {
      bg: "bg-orange-50",
      border: "border-orange-200",
      icon: "text-orange-600",
      accent: "bg-orange-600"
    },
    purple: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: "text-purple-600",
      accent: "bg-purple-600"
    },
    red: {
      bg: "bg-red-50",
      border: "border-red-200",
      icon: "text-red-600",
      accent: "bg-red-600"
    },
    indigo: {
      bg: "bg-indigo-50",
      border: "border-indigo-200",
      icon: "text-indigo-600",
      accent: "bg-indigo-600"
    }
  };

  return (
    <section id="objectives" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Our Mission & Objectives
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            CompassionCare is committed to creating a more compassionate world through comprehensive 
            humanitarian initiatives. Our objectives guide every action we take and every life we touch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((objective, index) => (
            <div 
              key={index}
              className={`${colorClasses[objective.color].bg} ${colorClasses[objective.color].border} border-2 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl`}
            >
              <div className="flex items-center mb-4">
                <div className={`w-12 h-12 ${colorClasses[objective.color].accent} rounded-full flex items-center justify-center mr-4`}>
                  <objective.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {objective.title}
                </h3>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {objective.description}
              </p>
              
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">Key Goals:</h4>
                <ul className="space-y-2">
                  {objective.goals.map((goal, goalIndex) => (
                    <li key={goalIndex} className="flex items-start">
                      <div className={`w-2 h-2 ${colorClasses[objective.color].accent} rounded-full mt-2 mr-3 flex-shrink-0`} />
                      <span className="text-sm text-gray-600">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-600 to-green-600 rounded-xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4">
            Join Us in Making a Difference
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-3xl mx-auto">
            Every objective we pursue is made possible by the support of compassionate individuals like you. 
            Together, we can create lasting positive change in our communities and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
            >
              Get Involved
            </button>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrganizationObjectives;