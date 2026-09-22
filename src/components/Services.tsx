import React from 'react';
import { Stethoscope, Home, Heart } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Stethoscope,
      title: "Assistance",
      description: "Veterinary care, vaccinations, feeding, and day-to-day support for animals in need.",
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
      title: "Cow Rescue Program/s",
      description: "",
      image: "/media/cow-rescue.jpg"
    }
  ];

  return (
    <section id="services" className="bg-pf-sage py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-6 text-4xl font-semibold text-pf-forest">
            Our Services
          </h2>
          <p className="mx-auto max-w-prose text-xl text-pf-muted">
            We care for animals at every stage — from treatment and daily assistance to finding them a permanent home.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {services.map((service, index) => (
            <div
              key={index}
              className="flex h-full flex-col overflow-hidden rounded-lg border border-pf-border bg-white transition-colors duration-200 hover:border-pf-moss hover:bg-pf-sage/40"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={service.image}
                  alt={`${service.title} at Prakriti Foundation`}
                  width={400}
                  height={300}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-pf-forest/80 via-pf-forest/10 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <service.icon className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
              </div>

              <div className={`flex flex-1 flex-col p-6 ${service.description ? '' : 'justify-center'}`}>
                <h3 className={`text-xl font-semibold text-pf-forest ${service.description ? 'mb-3' : ''}`}>
                  {service.title}
                </h3>
                {service.description && (
                  <p className="leading-relaxed text-pf-muted">
                    {service.description}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
