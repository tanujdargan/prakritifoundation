import React from 'react';
import { Target, Heart, Leaf, Users, Shield } from 'lucide-react';

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
      ]
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
      ]
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
      ]
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
      ]
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
      ]
    }
  ];

  return (
    <section id="objectives" className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-pf-forest mb-6">
            Our Mission & Objectives
          </h2>
          <p className="text-xl text-pf-muted max-w-3xl mx-auto leading-relaxed">
            Prakriti Foundation is committed to creating a more compassionate world through comprehensive
            humanitarian initiatives. Our objectives guide every action we take and every life we touch.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectives.map((objective, index) => (
            <div
              key={index}
              className="bg-white border border-pf-border rounded-lg p-6 transition-colors duration-200 hover:border-pf-moss hover:bg-pf-sage/40"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-pf-sage flex items-center justify-center mr-4 flex-shrink-0">
                  <objective.icon className="h-6 w-6 text-pf-forest" />
                </div>
                <h3 className="text-xl font-semibold text-pf-forest">
                  {objective.title}
                </h3>
              </div>

              <p className="text-pf-muted mb-6 leading-relaxed">
                {objective.description}
              </p>

              <div>
                <p className="font-semibold text-pf-ink mb-3">Key Goals:</p>
                <ul className="space-y-2">
                  {objective.goals.map((goal, goalIndex) => (
                    <li key={goalIndex} className="flex items-start">
                      <div className="w-2 h-2 bg-pf-moss rounded-full mt-2 mr-3 flex-shrink-0" />
                      <span className="text-sm text-pf-muted">{goal}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-pf-forest rounded-lg p-8 text-center text-white">
          <h3 className="text-2xl font-semibold mb-4">
            Join Us in Making a Difference
          </h3>
          <p className="text-lg text-pf-cream mb-6 max-w-3xl mx-auto">
            Every objective we pursue is made possible by the support of compassionate individuals like you.
            Together, we can create lasting positive change in our communities and beyond.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-pf-forest px-6 py-3 rounded-md font-semibold transition-colors duration-200 hover:bg-pf-cream cursor-pointer"
            >
              Get Involved
            </button>
            <button
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-white text-white px-6 py-3 rounded-md font-semibold transition-colors duration-200 hover:bg-white hover:text-pf-forest cursor-pointer"
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
