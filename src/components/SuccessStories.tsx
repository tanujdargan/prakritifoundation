import { useEffect, useState } from 'react';
import { Calendar, MapPin } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Story {
  id: string;
  name: string;
  location: string;
  date: string;
  before: string;
  after: string;
  story: string;
}

const SEED_STORIES: Story[] = [
  // The foundation supplied before/after photos but no written accounts.
  // The caption below describes only what the two photographs show; it is a
  // placeholder for the real story and should be replaced with theirs.
  {
    id: 'seed-calf',
    name: 'A calf off the roadside',
    location: 'Indore',
    date: 'September 2026',
    before: '/media/story-calf-before.jpg',
    after: '/media/story-calf-after.jpg',
    story: 'Picked up from the roadside by our team and moved to the shelter, where she is being fed and cared for.'
  }
];

const SuccessStories = () => {
  const [stories, setStories] = useState<Story[]>(SEED_STORIES);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      const { data, error } = await supabase
        .from('success_stories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) {
        console.error('Error fetching success stories:', error);
        setStories(SEED_STORIES);
        return;
      }

      if (data && data.length > 0) {
        setStories(
          data.map((row) => ({
            id: row.id,
            name: row.name,
            location: row.location || '',
            date: row.story_date || '',
            before: row.before_image_url || row.after_image_url,
            after: row.after_image_url,
            story: row.story
          }))
        );
      } else {
        setStories(SEED_STORIES);
      }
    } catch (error) {
      console.error('Error fetching success stories:', error);
      setStories(SEED_STORIES);
    }
  };

  return (
    <section id="stories" className="py-14 md:py-20 bg-pf-sage">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-semibold text-pf-forest mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-pf-muted max-w-3xl mx-auto">
            Every rescue tells a story of hope, healing, and new beginnings.
            Here are just a few of the lives we've been able to transform together.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {stories.map((story) => (
            <div
              key={story.id}
              className="bg-white border border-pf-border rounded-lg overflow-hidden transition-colors duration-200 hover:border-pf-moss"
            >
              <div className="grid grid-cols-2">
                <div className="relative aspect-[4/3]">
                  <img
                    src={story.before}
                    alt={`${story.name} before rescue and rehabilitation`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-pf-forest/10" />
                  <span className="absolute top-2 left-2 bg-pf-ink/80 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    Before
                  </span>
                </div>
                <div className="relative aspect-[4/3]">
                  <img
                    src={story.after}
                    alt={`${story.name} after rescue and rehabilitation`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-pf-forest/10" />
                  <span className="absolute top-2 right-2 bg-pf-marigold text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide">
                    After
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-pf-forest mb-3">
                  {story.name}
                </h3>

                <div className="flex items-center space-x-4 text-sm text-pf-muted mb-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4" />
                    <span>{story.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{story.date}</span>
                  </div>
                </div>

                <p className="text-pf-ink leading-relaxed">
                  {story.story}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg text-pf-muted mb-6">
            Want to be part of the next success story?
          </p>
          <button
            onClick={() => document.getElementById('help')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-pf-forest text-white px-8 py-3 rounded-md font-semibold transition-colors duration-200 hover:bg-pf-moss cursor-pointer"
          >
            Get Involved
          </button>
        </div>
      </div>
    </section>
  );
};

export default SuccessStories;
