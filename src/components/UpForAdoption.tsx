import { useEffect, useState } from 'react';
import { Cake, MapPin, ShieldCheck, Syringe, UserRound } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdoptableAnimal {
  id: string;
  name: string;
  species: string;
  age: string | null;
  gender: string | null;
  location: string | null;
  description: string;
  image_url: string;
  vaccinated: boolean;
  sterilized: boolean;
}

const SEED_ANIMALS: AdoptableAnimal[] = [
  // Real animals and photos supplied by the foundation. Age, gender and
  // vaccination status were NOT supplied — they are left blank rather than
  // guessed, because someone choosing to adopt relies on them.
  {
    id: 'seed-oreo',
    name: 'Oreo',
    species: 'Dog',
    age: '',
    gender: '',
    location: 'Indore',
    description: 'Oreo is looking for a home. Get in touch to arrange a visit and meet him.',
    image_url: '/media/adopt-oreo.jpg',
    vaccinated: false,
    sterilized: false
  },
  {
    id: 'seed-pluto',
    name: 'Pluto',
    species: 'Dog',
    age: '',
    gender: '',
    location: 'Indore',
    description: 'Pluto is looking for a home. Get in touch to arrange a visit and meet him.',
    image_url: '/media/adopt-pluto.jpg',
    vaccinated: false,
    sterilized: false
  }
];

const UpForAdoption = () => {
  const [animals, setAnimals] = useState<AdoptableAnimal[]>(SEED_ANIMALS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnimals();
  }, []);

  const fetchAnimals = async () => {
    try {
      const { data, error } = await supabase
        .from('adoptable_animals')
        .select('*')
        .eq('status', 'available')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching adoptable animals:', error);
        setAnimals(SEED_ANIMALS);
        return;
      }

      setAnimals(data && data.length > 0 ? data : SEED_ANIMALS);
    } catch (error) {
      console.error('Error fetching adoptable animals:', error);
      setAnimals(SEED_ANIMALS);
    } finally {
      setLoading(false);
    }
  };

  const handleEnquire = (name: string) => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    console.log(`Enquiry started for ${name}`);
  };

  return (
    <section id="adoption" className="py-14 md:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-pf-forest mb-6">
            Up for Adoption
          </h2>
          <p className="text-xl text-pf-muted max-w-3xl mx-auto">
            These rescued animals are healthy, loved, and ready to find their forever homes.
            Could one of them be your next family member?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 min-h-[24rem]">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white border border-pf-border rounded-lg overflow-hidden animate-pulse flex flex-col"
                >
                  <div className="aspect-[4/3] bg-pf-border" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-pf-border rounded w-1/2" />
                    <div className="h-4 bg-pf-border rounded w-3/4" />
                    <div className="h-4 bg-pf-border rounded w-full" />
                    <div className="h-4 bg-pf-border rounded w-full" />
                    <div className="h-10 bg-pf-border rounded w-full" />
                  </div>
                </div>
              ))
            : animals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white border border-pf-border rounded-lg overflow-hidden transition-colors duration-200 hover:border-pf-moss flex flex-col"
                >
                  <div className="relative aspect-[4/3] flex-shrink-0">
                    <img
                      src={animal.image_url}
                      alt={`${animal.name}, a ${animal.species.toLowerCase()} available for adoption`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-pf-forest/10" />
                    <span className="absolute top-2 left-2 bg-pf-forest text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                      {animal.species}
                    </span>
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-2xl font-semibold text-pf-forest mb-3">
                      {animal.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-pf-muted mb-4">
                      {animal.age && (
                        <div className="flex items-center space-x-1">
                          <Cake className="h-4 w-4" />
                          <span>{animal.age}</span>
                        </div>
                      )}
                      {animal.gender && (
                        <div className="flex items-center space-x-1">
                          <UserRound className="h-4 w-4" />
                          <span>{animal.gender}</span>
                        </div>
                      )}
                      {animal.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{animal.location}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-pf-muted leading-relaxed mb-4 flex-1">
                      {animal.description}
                    </p>

                    {(animal.vaccinated || animal.sterilized) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {animal.vaccinated && (
                          <span className="inline-flex items-center gap-1 bg-pf-sage text-pf-forest px-2.5 py-1 rounded-full text-xs font-medium">
                            <Syringe className="h-3 w-3" />
                            <span>Vaccinated</span>
                          </span>
                        )}
                        {animal.sterilized && (
                          <span className="inline-flex items-center gap-1 bg-pf-sage text-pf-forest px-2.5 py-1 rounded-full text-xs font-medium">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Sterilized</span>
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleEnquire(animal.name)}
                      className="mt-auto w-full inline-flex items-center justify-center bg-pf-marigold text-white px-4 py-3 rounded-md font-semibold min-h-[44px] transition-colors duration-200 hover:bg-pf-forest cursor-pointer"
                    >
                      Enquire about {animal.name}
                    </button>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
};

export default UpForAdoption;
