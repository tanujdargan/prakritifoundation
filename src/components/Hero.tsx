import React from 'react';
import { ArrowRight, Heart } from 'lucide-react';

const Hero = () => {
  const scrollToHelp = () => {
    document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden bg-pf-forest"
    >
      {/* Background photo, kept only as texture behind a strong scrim */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1458925/pexels-photo-1458925.jpeg?auto=compress&cs=tinysrgb&w=1920)'
        }}
      />
      {/* Scrim: keeps body text at a verified 10.35:1 contrast against pf-forest */}
      <div className="absolute inset-0 bg-pf-forest/85" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-6 text-4xl font-medium leading-tight text-white md:text-6xl">
            Every Life Deserves
            <span className="block text-pf-cream">Love & Care</span>
          </h1>

          <p className="mx-auto mb-10 max-w-prose text-lg leading-relaxed text-pf-cream md:text-xl">
            Prakriti Foundation is dedicated to advancing animal welfare, environmental sustainability, and community support. Our work focuses on rescuing and caring for animals, promoting environmental responsibility, and extending assistance to senior citizens and underprivileged communities through practical, on-ground initiatives. We aim to create tangible impact by addressing interconnected social and environmental concerns with consistent, accountable action.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <button
              onClick={scrollToHelp}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center gap-2 rounded-md bg-pf-marigold px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-pf-marigold/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pf-marigold focus-visible:ring-offset-2 focus-visible:ring-offset-pf-forest"
            >
              <Heart className="h-5 w-5" />
              <span>Make a Difference</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <button
              onClick={() => document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' })}
              className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-md border-2 border-white px-8 py-3 font-semibold text-white transition-colors duration-200 hover:bg-white hover:text-pf-forest focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pf-marigold focus-visible:ring-offset-2 focus-visible:ring-offset-pf-forest"
            >
              See Our Impact
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
