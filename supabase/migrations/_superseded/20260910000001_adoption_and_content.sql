/*
  # Add Adoption and Content Management Tables

  1. New Tables
    - `adoptable_animals`
      - `id` (uuid, primary key)
      - `name` (text)
      - `species` (text, default 'Dog')
      - `age` (text, optional, free text e.g. "8 months")
      - `gender` (text, optional)
      - `location` (text, optional)
      - `description` (text)
      - `image_url` (text)
      - `vaccinated` (boolean, default false)
      - `sterilized` (boolean, default false)
      - `status` (enum: available, pending, adopted)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)

    - `success_stories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `location` (text, optional)
      - `story_date` (text, optional, free text e.g. "December 2024")
      - `before_image_url` (text, optional)
      - `after_image_url` (text)
      - `story` (text)
      - `sort_order` (integer, default 0)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - This content is public marketing content, so anyone (including the
      anon key used by the public website) may read it
    - Only authenticated staff may insert, update or delete

  3. Storage
    - Create a public `content` bucket for animal and story photos
      uploaded by staff through the admin Content Manager
    - Anyone may read files in the bucket; only authenticated users
      may upload or delete files
*/

CREATE TABLE IF NOT EXISTS adoptable_animals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  species text NOT NULL DEFAULT 'Dog',
  age text,
  gender text,
  location text,
  description text NOT NULL,
  image_url text NOT NULL,
  vaccinated boolean DEFAULT false,
  sterilized boolean DEFAULT false,
  status text DEFAULT 'available' CHECK (status IN ('available', 'pending', 'adopted')),
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE adoptable_animals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read adoptable animals"
  ON adoptable_animals
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert adoptable animals"
  ON adoptable_animals
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update adoptable animals"
  ON adoptable_animals
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete adoptable animals"
  ON adoptable_animals
  FOR DELETE
  TO authenticated
  USING (true);

CREATE TABLE IF NOT EXISTS success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  location text,
  story_date text,
  before_image_url text,
  after_image_url text NOT NULL,
  story text NOT NULL,
  sort_order int DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE success_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read success stories"
  ON success_stories
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert success stories"
  ON success_stories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update success stories"
  ON success_stories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete success stories"
  ON success_stories
  FOR DELETE
  TO authenticated
  USING (true);

INSERT INTO storage.buckets (id, name, public)
VALUES ('content', 'content', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view content bucket files"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'content');

CREATE POLICY "Authenticated users can upload content bucket files"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'content');

CREATE POLICY "Authenticated users can update content bucket files"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'content')
  WITH CHECK (bucket_id = 'content');

CREATE POLICY "Authenticated users can delete content bucket files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'content');
