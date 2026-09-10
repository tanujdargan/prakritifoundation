import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, PawPrint, Sparkles, Trash2, Upload } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AdoptableAnimalRow {
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
  status: 'available' | 'pending' | 'adopted';
  sort_order: number;
}

interface SuccessStoryRow {
  id: string;
  name: string;
  location: string | null;
  story_date: string | null;
  before_image_url: string | null;
  after_image_url: string;
  story: string;
  sort_order: number;
}

const emptyAnimalForm = {
  name: '',
  species: 'Dog',
  age: '',
  gender: '',
  location: '',
  description: '',
  image_url: '',
  vaccinated: false,
  sterilized: false,
  status: 'available' as 'available' | 'pending' | 'adopted',
  sort_order: 0
};

const emptyStoryForm = {
  name: '',
  location: '',
  story_date: '',
  before_image_url: '',
  after_image_url: '',
  story: '',
  sort_order: 0
};

const sanitizeFileName = (fileName: string) =>
  fileName.replace(/[^a-zA-Z0-9._-]/g, '-');

const ContentManager = () => {
  const [subTab, setSubTab] = useState<'animals' | 'stories'>('animals');

  const [animals, setAnimals] = useState<AdoptableAnimalRow[]>([]);
  const [stories, setStories] = useState<SuccessStoryRow[]>([]);
  const [loading, setLoading] = useState(true);

  const [animalForm, setAnimalForm] = useState(emptyAnimalForm);
  const [storyForm, setStoryForm] = useState(emptyStoryForm);

  const [uploadingAnimalImage, setUploadingAnimalImage] = useState(false);
  const [uploadingBeforeImage, setUploadingBeforeImage] = useState(false);
  const [uploadingAfterImage, setUploadingAfterImage] = useState(false);

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchAnimals();
    fetchStories();
  }, []);

  const fetchAnimals = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('adoptable_animals')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setAnimals(data || []);
    } catch (err) {
      console.error('Error fetching adoptable animals:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStories = async () => {
    try {
      const { data, error: fetchError } = await supabase
        .from('success_stories')
        .select('*')
        .order('sort_order', { ascending: true });

      if (fetchError) throw fetchError;
      setStories(data || []);
    } catch (err) {
      console.error('Error fetching success stories:', err);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const path = `${Date.now()}-${sanitizeFileName(file.name)}`;
    const { error: uploadError } = await supabase.storage
      .from('content')
      .upload(path, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage.from('content').getPublicUrl(path);
    return data.publicUrl;
  };

  const handleAnimalImageUpload = async (file: File | undefined) => {
    if (!file) return;
    setError('');
    setUploadingAnimalImage(true);
    try {
      const url = await uploadImage(file);
      setAnimalForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? `Image upload failed: ${err.message}` : 'Image upload failed.');
    } finally {
      setUploadingAnimalImage(false);
    }
  };

  const handleStoryImageUpload = async (
    file: File | undefined,
    field: 'before_image_url' | 'after_image_url'
  ) => {
    if (!file) return;
    setError('');
    const setUploading = field === 'before_image_url' ? setUploadingBeforeImage : setUploadingAfterImage;
    setUploading(true);
    try {
      const url = await uploadImage(file);
      setStoryForm((prev) => ({ ...prev, [field]: url }));
    } catch (err) {
      console.error('Error uploading image:', err);
      setError(err instanceof Error ? `Image upload failed: ${err.message}` : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const addAnimal = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!animalForm.image_url) {
      setError('Please upload a photo before adding the animal.');
      return;
    }

    try {
      const { error: insertError } = await supabase.from('adoptable_animals').insert(animalForm);
      if (insertError) throw insertError;

      setMessage(`${animalForm.name} was added successfully.`);
      setAnimalForm(emptyAnimalForm);
      fetchAnimals();
    } catch (err) {
      console.error('Error adding animal:', err);
      setError(err instanceof Error ? err.message : 'Failed to add animal.');
    }
  };

  const addStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!storyForm.after_image_url) {
      setError('Please upload an "after" photo before adding the story.');
      return;
    }

    try {
      const { error: insertError } = await supabase.from('success_stories').insert(storyForm);
      if (insertError) throw insertError;

      setMessage(`${storyForm.name} was added successfully.`);
      setStoryForm(emptyStoryForm);
      fetchStories();
    } catch (err) {
      console.error('Error adding story:', err);
      setError(err instanceof Error ? err.message : 'Failed to add story.');
    }
  };

  const deleteAnimal = async (id: string, name: string) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      const { error: deleteError } = await supabase.from('adoptable_animals').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setAnimals((prev) => prev.filter((animal) => animal.id !== id));
    } catch (err) {
      console.error('Error deleting animal:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete animal.');
    }
  };

  const deleteStory = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;

    try {
      const { error: deleteError } = await supabase.from('success_stories').delete().eq('id', id);
      if (deleteError) throw deleteError;
      setStories((prev) => prev.filter((story) => story.id !== id));
    } catch (err) {
      console.error('Error deleting story:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete story.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div
          className="animate-spin rounded-full h-10 w-10 border-2 border-pf-border border-t-pf-forest"
          aria-hidden="true"
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-pf-forest flex items-center">
        <Sparkles className="h-6 w-6 mr-2 text-pf-moss" aria-hidden="true" />
        Content Manager
      </h2>

      <div className="flex space-x-4 border-b border-pf-border">
        <button
          onClick={() => setSubTab('animals')}
          className={`pb-3 px-1 border-b-2 text-sm cursor-pointer transition-colors ${
            subTab === 'animals'
              ? 'border-pf-forest font-semibold text-pf-forest'
              : 'border-transparent font-medium text-pf-muted hover:text-pf-forest'
          }`}
        >
          Adoptable Animals
        </button>
        <button
          onClick={() => setSubTab('stories')}
          className={`pb-3 px-1 border-b-2 text-sm cursor-pointer transition-colors ${
            subTab === 'stories'
              ? 'border-pf-forest font-semibold text-pf-forest'
              : 'border-transparent font-medium text-pf-muted hover:text-pf-forest'
          }`}
        >
          Success Stories
        </button>
      </div>

      {error && (
        <div role="alert" className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      {message && (
        <div role="status" className="bg-pf-sage border border-pf-moss/30 text-pf-forest px-4 py-3 rounded-md">
          {message}
        </div>
      )}

      {subTab === 'animals' && (
        <div className="space-y-6">
          <div className="bg-white border border-pf-border p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-pf-ink mb-4 flex items-center">
              <PawPrint className="h-5 w-5 mr-2 text-pf-moss" aria-hidden="true" />
              Add Adoptable Animal
            </h3>
            <form onSubmit={addAnimal} className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="animal-name" className="block text-sm font-medium text-pf-ink mb-2">Name *</label>
                <input
                  id="animal-name"
                  type="text"
                  required
                  value={animalForm.name}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="animal-species" className="block text-sm font-medium text-pf-ink mb-2">Species</label>
                <input
                  id="animal-species"
                  type="text"
                  value={animalForm.species}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, species: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="animal-age" className="block text-sm font-medium text-pf-ink mb-2">Age</label>
                <input
                  id="animal-age"
                  type="text"
                  placeholder="e.g. 8 months"
                  value={animalForm.age}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, age: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="animal-gender" className="block text-sm font-medium text-pf-ink mb-2">Gender</label>
                <input
                  id="animal-gender"
                  type="text"
                  placeholder="Male / Female"
                  value={animalForm.gender}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="animal-location" className="block text-sm font-medium text-pf-ink mb-2">Location</label>
                <input
                  id="animal-location"
                  type="text"
                  value={animalForm.location}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="animal-status" className="block text-sm font-medium text-pf-ink mb-2">Status</label>
                <select
                  id="animal-status"
                  value={animalForm.status}
                  onChange={(e) =>
                    setAnimalForm((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))
                  }
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label htmlFor="animal-description" className="block text-sm font-medium text-pf-ink mb-2">Description *</label>
                <textarea
                  id="animal-description"
                  required
                  rows={3}
                  value={animalForm.description}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div className="flex items-center space-x-6">
                <label htmlFor="animal-vaccinated" className="flex items-center space-x-2 text-sm text-pf-ink cursor-pointer">
                  <input
                    id="animal-vaccinated"
                    type="checkbox"
                    checked={animalForm.vaccinated}
                    onChange={(e) => setAnimalForm((prev) => ({ ...prev, vaccinated: e.target.checked }))}
                    className="cursor-pointer"
                  />
                  <span>Vaccinated</span>
                </label>
                <label htmlFor="animal-sterilized" className="flex items-center space-x-2 text-sm text-pf-ink cursor-pointer">
                  <input
                    id="animal-sterilized"
                    type="checkbox"
                    checked={animalForm.sterilized}
                    onChange={(e) => setAnimalForm((prev) => ({ ...prev, sterilized: e.target.checked }))}
                    className="cursor-pointer"
                  />
                  <span>Sterilized</span>
                </label>
              </div>
              <div>
                <label htmlFor="animal-photo" className="flex items-center text-sm font-medium text-pf-ink mb-2">
                  <ImageIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Photo *
                </label>
                <input
                  id="animal-photo"
                  type="file"
                  accept="image/*"
                  disabled={uploadingAnimalImage}
                  onChange={(e) => handleAnimalImageUpload(e.target.files?.[0])}
                  className="w-full text-sm text-pf-muted cursor-pointer"
                />
                {uploadingAnimalImage && (
                  <p className="text-sm text-pf-moss mt-1 flex items-center" role="status">
                    <Upload className="h-4 w-4 mr-1 animate-pulse" aria-hidden="true" />
                    Uploading photo...
                  </p>
                )}
                {animalForm.image_url && !uploadingAnimalImage && (
                  <img
                    src={animalForm.image_url}
                    alt="Preview"
                    loading="lazy"
                    width={80}
                    height={80}
                    className="mt-2 h-20 w-20 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploadingAnimalImage}
                  className="h-11 px-6 inline-flex items-center rounded-md bg-pf-forest text-white font-medium transition-colors hover:bg-pf-moss disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Add Animal
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-pf-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pf-border">
                <thead className="bg-pf-sage/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Animal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pf-border">
                  {animals.map((animal) => (
                    <tr key={animal.id} className="hover:bg-pf-sage/20">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={animal.image_url}
                            alt={animal.name}
                            loading="lazy"
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover rounded-md"
                          />
                          <div className="text-sm font-medium text-pf-ink">{animal.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-pf-ink">{animal.species} · {animal.age || '—'}</div>
                        <div className="text-sm text-pf-muted">{animal.location || '—'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="inline-flex px-2.5 py-1 text-xs font-semibold rounded-full bg-pf-sage text-pf-forest">
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium">
                        <button
                          onClick={() => deleteAnimal(animal.id, animal.name)}
                          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 text-red-800 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {animals.length === 0 && (
              <div className="text-center py-12">
                <PawPrint className="h-12 w-12 text-pf-border mx-auto mb-4" aria-hidden="true" />
                <p className="text-pf-muted">No adoptable animals added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'stories' && (
        <div className="space-y-6">
          <div className="bg-white border border-pf-border p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-pf-ink mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-pf-moss" aria-hidden="true" />
              Add Success Story
            </h3>
            <form onSubmit={addStory} className="grid md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="story-name" className="block text-sm font-medium text-pf-ink mb-2">Name / Title *</label>
                <input
                  id="story-name"
                  type="text"
                  required
                  value={storyForm.name}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="story-location" className="block text-sm font-medium text-pf-ink mb-2">Location</label>
                <input
                  id="story-location"
                  type="text"
                  value={storyForm.location}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="story-date" className="block text-sm font-medium text-pf-ink mb-2">Date</label>
                <input
                  id="story-date"
                  type="text"
                  placeholder="e.g. December 2024"
                  value={storyForm.story_date}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, story_date: e.target.value }))}
                  className="w-full h-11 px-4 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div className="md:col-span-2">
                <label htmlFor="story-text" className="block text-sm font-medium text-pf-ink mb-2">Story *</label>
                <textarea
                  id="story-text"
                  required
                  rows={3}
                  value={storyForm.story}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, story: e.target.value }))}
                  className="w-full px-4 py-2 border border-pf-border rounded-md text-pf-ink"
                />
              </div>
              <div>
                <label htmlFor="story-before-photo" className="flex items-center text-sm font-medium text-pf-ink mb-2">
                  <ImageIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  Before Photo
                </label>
                <input
                  id="story-before-photo"
                  type="file"
                  accept="image/*"
                  disabled={uploadingBeforeImage}
                  onChange={(e) => handleStoryImageUpload(e.target.files?.[0], 'before_image_url')}
                  className="w-full text-sm text-pf-muted cursor-pointer"
                />
                {uploadingBeforeImage && (
                  <p className="text-sm text-pf-moss mt-1 flex items-center" role="status">
                    <Upload className="h-4 w-4 mr-1 animate-pulse" aria-hidden="true" />
                    Uploading photo...
                  </p>
                )}
                {storyForm.before_image_url && !uploadingBeforeImage && (
                  <img
                    src={storyForm.before_image_url}
                    alt="Before preview"
                    loading="lazy"
                    width={80}
                    height={80}
                    className="mt-2 h-20 w-20 object-cover rounded-md"
                  />
                )}
              </div>
              <div>
                <label htmlFor="story-after-photo" className="flex items-center text-sm font-medium text-pf-ink mb-2">
                  <ImageIcon className="h-4 w-4 mr-1" aria-hidden="true" />
                  After Photo *
                </label>
                <input
                  id="story-after-photo"
                  type="file"
                  accept="image/*"
                  disabled={uploadingAfterImage}
                  onChange={(e) => handleStoryImageUpload(e.target.files?.[0], 'after_image_url')}
                  className="w-full text-sm text-pf-muted cursor-pointer"
                />
                {uploadingAfterImage && (
                  <p className="text-sm text-pf-moss mt-1 flex items-center" role="status">
                    <Upload className="h-4 w-4 mr-1 animate-pulse" aria-hidden="true" />
                    Uploading photo...
                  </p>
                )}
                {storyForm.after_image_url && !uploadingAfterImage && (
                  <img
                    src={storyForm.after_image_url}
                    alt="After preview"
                    loading="lazy"
                    width={80}
                    height={80}
                    className="mt-2 h-20 w-20 object-cover rounded-md"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploadingBeforeImage || uploadingAfterImage}
                  className="h-11 px-6 inline-flex items-center rounded-md bg-pf-forest text-white font-medium transition-colors hover:bg-pf-moss disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  Add Story
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-pf-border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-pf-border">
                <thead className="bg-pf-sage/40">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Story</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-pf-muted uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-pf-border">
                  {stories.map((story) => (
                    <tr key={story.id} className="hover:bg-pf-sage/20">
                      <td className="px-6 py-5">
                        <div className="flex items-center space-x-3">
                          <img
                            src={story.after_image_url}
                            alt={story.name}
                            loading="lazy"
                            width={40}
                            height={40}
                            className="h-10 w-10 object-cover rounded-md"
                          />
                          <div className="text-sm font-medium text-pf-ink">{story.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-pf-ink">{story.location || '—'}</div>
                        <div className="text-sm text-pf-muted">{story.story_date || '—'}</div>
                      </td>
                      <td className="px-6 py-5 text-sm font-medium">
                        <button
                          onClick={() => deleteStory(story.id, story.name)}
                          className="inline-flex h-9 cursor-pointer items-center gap-1 rounded-md border border-red-200 px-3 text-red-800 transition-colors hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {stories.length === 0 && (
              <div className="text-center py-12">
                <Sparkles className="h-12 w-12 text-pf-border mx-auto mb-4" aria-hidden="true" />
                <p className="text-pf-muted">No success stories added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
