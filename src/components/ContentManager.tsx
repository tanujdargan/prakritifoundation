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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 flex items-center">
        <Sparkles className="h-6 w-6 mr-2 text-teal-600" />
        Content Manager
      </h2>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          onClick={() => setSubTab('animals')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm ${
            subTab === 'animals'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Adoptable Animals
        </button>
        <button
          onClick={() => setSubTab('stories')}
          className={`pb-3 px-1 border-b-2 font-medium text-sm ${
            subTab === 'stories'
              ? 'border-teal-500 text-teal-600'
              : 'border-transparent text-gray-500 hover:text-gray-700'
          }`}
        >
          Success Stories
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
          {message}
        </div>
      )}

      {subTab === 'animals' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PawPrint className="h-5 w-5 mr-2 text-teal-600" />
              Add Adoptable Animal
            </h3>
            <form onSubmit={addAnimal} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={animalForm.name}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Species</label>
                <input
                  type="text"
                  value={animalForm.species}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, species: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                <input
                  type="text"
                  placeholder="e.g. 8 months"
                  value={animalForm.age}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, age: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <input
                  type="text"
                  placeholder="Male / Female"
                  value={animalForm.gender}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, gender: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={animalForm.location}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={animalForm.status}
                  onChange={(e) =>
                    setAnimalForm((prev) => ({ ...prev, status: e.target.value as typeof prev.status }))
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                >
                  <option value="available">Available</option>
                  <option value="pending">Pending</option>
                  <option value="adopted">Adopted</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={animalForm.description}
                  onChange={(e) => setAnimalForm((prev) => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={animalForm.vaccinated}
                    onChange={(e) => setAnimalForm((prev) => ({ ...prev, vaccinated: e.target.checked }))}
                  />
                  <span>Vaccinated</span>
                </label>
                <label className="flex items-center space-x-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={animalForm.sterilized}
                    onChange={(e) => setAnimalForm((prev) => ({ ...prev, sterilized: e.target.checked }))}
                  />
                  <span>Sterilized</span>
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4 inline mr-1" />
                  Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingAnimalImage}
                  onChange={(e) => handleAnimalImageUpload(e.target.files?.[0])}
                  className="w-full text-sm text-gray-600"
                />
                {uploadingAnimalImage && (
                  <p className="text-sm text-teal-600 mt-1 flex items-center">
                    <Upload className="h-4 w-4 mr-1 animate-pulse" />
                    Uploading photo...
                  </p>
                )}
                {animalForm.image_url && !uploadingAnimalImage && (
                  <img
                    src={animalForm.image_url}
                    alt="Preview"
                    className="mt-2 h-20 w-20 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploadingAnimalImage}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Add Animal
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Animal</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {animals.map((animal) => (
                    <tr key={animal.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img src={animal.image_url} alt={animal.name} className="h-10 w-10 object-cover rounded-lg" />
                          <div className="text-sm font-medium text-gray-900">{animal.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{animal.species} · {animal.age || '—'}</div>
                        <div className="text-sm text-gray-500">{animal.location || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-teal-100 text-teal-800">
                          {animal.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteAnimal(animal.id, animal.name)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
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
                <PawPrint className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No adoptable animals added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {subTab === 'stories' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2 text-teal-600" />
              Add Success Story
            </h3>
            <form onSubmit={addStory} className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Name / Title *</label>
                <input
                  type="text"
                  required
                  value={storyForm.name}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={storyForm.location}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, location: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input
                  type="text"
                  placeholder="e.g. December 2024"
                  value={storyForm.story_date}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, story_date: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Story *</label>
                <textarea
                  required
                  rows={3}
                  value={storyForm.story}
                  onChange={(e) => setStoryForm((prev) => ({ ...prev, story: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4 inline mr-1" />
                  Before Photo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingBeforeImage}
                  onChange={(e) => handleStoryImageUpload(e.target.files?.[0], 'before_image_url')}
                  className="w-full text-sm text-gray-600"
                />
                {uploadingBeforeImage && (
                  <p className="text-sm text-teal-600 mt-1 flex items-center">
                    <Upload className="h-4 w-4 mr-1 animate-pulse" />
                    Uploading photo...
                  </p>
                )}
                {storyForm.before_image_url && !uploadingBeforeImage && (
                  <img
                    src={storyForm.before_image_url}
                    alt="Before preview"
                    className="mt-2 h-20 w-20 object-cover rounded-lg"
                  />
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <ImageIcon className="h-4 w-4 inline mr-1" />
                  After Photo *
                </label>
                <input
                  type="file"
                  accept="image/*"
                  disabled={uploadingAfterImage}
                  onChange={(e) => handleStoryImageUpload(e.target.files?.[0], 'after_image_url')}
                  className="w-full text-sm text-gray-600"
                />
                {uploadingAfterImage && (
                  <p className="text-sm text-teal-600 mt-1 flex items-center">
                    <Upload className="h-4 w-4 mr-1 animate-pulse" />
                    Uploading photo...
                  </p>
                )}
                {storyForm.after_image_url && !uploadingAfterImage && (
                  <img
                    src={storyForm.after_image_url}
                    alt="After preview"
                    className="mt-2 h-20 w-20 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="md:col-span-2">
                <button
                  type="submit"
                  disabled={uploadingBeforeImage || uploadingAfterImage}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-semibold transition-colors"
                >
                  Add Story
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Story</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {stories.map((story) => (
                    <tr key={story.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-3">
                          <img src={story.after_image_url} alt={story.name} className="h-10 w-10 object-cover rounded-lg" />
                          <div className="text-sm font-medium text-gray-900">{story.name}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{story.location || '—'}</div>
                        <div className="text-sm text-gray-500">{story.story_date || '—'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => deleteStory(story.id, story.name)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
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
                <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No success stories added yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentManager;
