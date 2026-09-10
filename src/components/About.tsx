import React from 'react';
import { Heart, Leaf, Users, Shield } from 'lucide-react';
import { ORG } from '../lib/organization';

const pillars = [
  {
    icon: Heart,
    title: 'Animal Welfare',
    description: 'Rescuing, treating, and finding loving homes for stray and abandoned animals.',
  },
  {
    icon: Leaf,
    title: 'Environmental Care',
    description: 'Future initiatives to protect our environment and promote sustainable living.',
  },
  {
    icon: Users,
    title: 'Community Support',
    description: 'Planned programs to support underprivileged families and communities in need.',
  },
  {
    icon: Shield,
    title: 'Senior Care',
    description: 'Future services to provide support and companionship for elderly community members.',
  },
];

const About = () => {
  return (
    <section id="about" className="bg-white py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-semibold text-pf-forest">
            About {ORG.name}
          </h2>
          <p className="mx-auto max-w-prose text-xl leading-relaxed text-pf-muted">
            We are a humanitarian organization dedicated to creating positive change in our world.
            Starting with animal welfare, we're expanding our mission to address environmental challenges
            and support underprivileged communities and senior citizens.
          </p>
        </div>

        <div className="mb-16 grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h3 className="mb-6 text-2xl font-semibold text-pf-forest">Our Mission</h3>
            <p className="mb-6 leading-relaxed text-pf-muted">
              {ORG.name} was founded with a simple belief: every living being deserves love, care, and dignity.
              What started as a passion for rescuing and rehabilitating stray dogs has grown into a comprehensive
              humanitarian mission.
            </p>
            <p className="leading-relaxed text-pf-muted">
              Today, we continue our vital animal welfare work while preparing to expand into environmental
              conservation, supporting underprivileged communities, and caring for our elderly.
              Our holistic approach recognizes that true compassion knows no boundaries.
            </p>
          </div>

          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Volunteers caring for rescued animals at a Prakriti Foundation shelter"
              width={800}
              height={600}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-md border border-pf-border object-cover"
            />
          </div>
        </div>

        {/* A bordered, numbered list rather than four identical icon circles */}
        <div className="border-t border-pf-border">
          {pillars.map((pillar, index) => (
            <div
              key={pillar.title}
              className="grid gap-3 border-b border-pf-border py-8 md:grid-cols-[16rem_1fr] md:items-start md:gap-8"
            >
              <div className="flex items-center gap-4">
                <span className="font-display text-3xl text-pf-moss/50">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <div className="flex items-center gap-3">
                  <pillar.icon className="h-6 w-6 flex-shrink-0 text-pf-moss" aria-hidden="true" />
                  <h4 className="text-xl font-semibold text-pf-forest">{pillar.title}</h4>
                </div>
              </div>
              <p className="leading-relaxed text-pf-muted md:pt-1">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
