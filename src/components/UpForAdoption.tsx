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
  {
    id: 'seed-1',
    name: 'Rocky',
    species: 'Dog',
    age: '8 months',
    gender: 'Male',
    location: 'Indore',
    description: 'Rocky is a playful, affectionate pup who loves company and gets along well with children and other dogs.',
    image_url: 'https://images.pexels.com/photos/1254140/pexels-photo-1254140.jpeg?auto=compress&cs=tinysrgb&w=400',
    vaccinated: true,
    sterilized: false
  },
  {
    id: 'seed-2',
    name: 'Coco',
    species: 'Dog',
    age: 'approx 2 years',
    gender: 'Female',
    location: 'Indore',
    description: 'Coco was rescued from a busy street and has since become calm, gentle, and eager to please. She is looking for a quiet, loving home.',
    image_url: 'https://images.pexels.com/photos/6235232/pexels-photo-6235232.jpeg?auto=compress&cs=tinysrgb&w=400',
    vaccinated: true,
    sterilized: true
  },
  {
    id: 'seed-3',
    name: 'Simba',
    species: 'Dog',
    age: '1.5 years',
    gender: 'Male',
    location: 'Indore',
    description: 'Simba is full of energy and loves long walks. He is well socialized and would do best in an active household.',
    image_url: 'https://images.pexels.com/photos/1490908/pexels-photo-1490908.jpeg?auto=compress&cs=tinysrgb&w=400',
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
    <section id="adoption" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Up for Adoption
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            These rescued animals are healthy, loved, and ready to find their forever homes.
            Could one of them be your next family member?
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 min-h-[24rem]">
          {loading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-gray-200" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-10 bg-gray-200 rounded w-full" />
                  </div>
                </div>
              ))
            : animals.map((animal) => (
                <div
                  key={animal.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative h-56">
                    <img
                      src={animal.image_url}
                      alt={animal.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                      {animal.species}
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      {animal.name}
                    </h3>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mb-4">
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

                    <p className="text-gray-600 leading-relaxed mb-4">
                      {animal.description}
                    </p>

                    {(animal.vaccinated || animal.sterilized) && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {animal.vaccinated && (
                          <span className="inline-flex items-center space-x-1 bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold">
                            <Syringe className="h-3 w-3" />
                            <span>Vaccinated</span>
                          </span>
                        )}
                        {animal.sterilized && (
                          <span className="inline-flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            <ShieldCheck className="h-3 w-3" />
                            <span>Sterilized</span>
                          </span>
                        )}
                      </div>
                    )}

                    <button
                      onClick={() => handleEnquire(animal.name)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-300"
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
