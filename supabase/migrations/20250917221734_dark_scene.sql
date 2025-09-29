/*
  # Create Organization Management Tables

  1. New Tables
    - `organization_awards`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `awarded_by` (text)
      - `award_date` (date)
      - `certificate_url` (text, optional)
      - `image_url` (text, optional)
      - `created_at` (timestamp)
    
    - `members`
      - `id` (uuid, primary key)
      - `member_id` (text, unique)
      - `name` (text)
      - `email` (text)
      - `phone` (text)
      - `address` (text)
      - `membership_type` (text)
      - `status` (enum: active, blocked, inactive)
      - `membership_fee_paid` (boolean)
      - `bank_details` (text, optional)
      - `qr_code_url` (text, optional)
      - `coordinator_id` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `staff`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `role` (enum: admin, manager, coordinator)
      - `password_hash` (text)
      - `permissions` (text array)
      - `status` (enum: active, inactive)
      - `created_at` (timestamp)
    
    - `donation_receipts`
      - `id` (uuid, primary key)
      - `receipt_no` (text, unique)
      - `date` (date)
      - `payment_method` (text)
      - `donator_name` (text)
      - `amount` (numeric)
      - `amount_in_words` (text)
      - `pan_number` (text, optional)
      - `aadhar_number` (text, optional)
      - `received_by` (text)
      - `created_at` (timestamp)
    
    - `volunteer_certificates`
      - `id` (uuid, primary key)
      - `certificate_no` (text, unique)
      - `volunteer_name` (text)
      - `email` (text)
      - `phone` (text, optional)
      - `volunteer_type` (text)
      - `hours_contributed` (integer)
      - `start_date` (date)
      - `end_date` (date)
      - `achievements` (text, optional)
      - `supervisor_name` (text)
      - `certificate_type` (text)
      - `status` (text)
      - `created_at` (timestamp)
    
    - `appointment_letters`
      - `id` (uuid, primary key)
      - `letter_no` (text, unique)
      - `member_id` (text)
      - `position` (text)
      - `appointment_date` (date)
      - `terms` (text, optional)
      - `qr_code_url` (text, optional)
      - `issued_by` (text)
      - `status` (enum: active, revoked)
      - `created_at` (timestamp)
    
    - `events`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `event_date` (date)
      - `location` (text)
      - `images` (text array)
      - `youtube_links` (text array)
      - `status` (enum: upcoming, completed, cancelled)
      - `created_by` (text)
      - `created_at` (timestamp)
    
    - `projects`
      - `id` (uuid, primary key)
      - `title` (text)
      - `description` (text)
      - `objectives` (text array)
      - `status` (enum: active, completed, paused)
      - `start_date` (date)
      - `end_date` (date, optional)
      - `budget` (numeric, optional)
      - `images` (text array)
      - `documents` (text array)
      - `created_at` (timestamp)
    
    - `member_problems`
      - `id` (uuid, primary key)
      - `member_name` (text)
      - `email` (text)
      - `phone` (text)
      - `problem_description` (text)
      - `category` (text)
      - `priority` (enum: low, medium, high)
      - `status` (enum: open, in_progress, resolved)
      - `assigned_to` (text, optional)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `audit_reports`
      - `id` (uuid, primary key)
      - `year` (integer)
      - `title` (text)
      - `description` (text)
      - `report_url` (text)
      - `uploaded_by` (text)
      - `created_at` (timestamp)
    
    - `management_team`
      - `id` (uuid, primary key)
      - `name` (text)
      - `position` (text)
      - `bio` (text)
      - `image_url` (text, optional)
      - `email` (text)
      - `phone` (text, optional)
      - `order_index` (integer)
      - `status` (enum: active, inactive)
      - `created_at` (timestamp)
    
    - `website_content`
      - `id` (uuid, primary key)
      - `section` (text)
      - `content_key` (text)
      - `content_value` (text)
      - `language` (enum: en, hi)
      - `updated_by` (text)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create organization_awards table
CREATE TABLE IF NOT EXISTS organization_awards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  awarded_by text NOT NULL,
  award_date date NOT NULL,
  certificate_url text,
  image_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE organization_awards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read organization awards"
  ON organization_awards
  FOR SELECT
  TO public
  USING (true);

-- Create members table
CREATE TABLE IF NOT EXISTS members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id text UNIQUE NOT NULL,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  membership_type text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'blocked', 'inactive')),
  membership_fee_paid boolean DEFAULT false,
  bank_details text,
  qr_code_url text,
  coordinator_id text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read members"
  ON members
  FOR SELECT
  TO public
  USING (true);

-- Create staff table
CREATE TABLE IF NOT EXISTS staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  role text NOT NULL CHECK (role IN ('admin', 'manager', 'coordinator')),
  password_hash text NOT NULL,
  permissions text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE staff ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Staff can read own data"
  ON staff
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = id::text);

-- Create donation_receipts table
CREATE TABLE IF NOT EXISTS donation_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_no text UNIQUE NOT NULL,
  date date NOT NULL,
  payment_method text NOT NULL,
  donator_name text NOT NULL,
  amount numeric NOT NULL,
  amount_in_words text NOT NULL,
  pan_number text,
  aadhar_number text,
  received_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE donation_receipts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read donation receipts"
  ON donation_receipts
  FOR SELECT
  TO public
  USING (true);

-- Create volunteer_certificates table
CREATE TABLE IF NOT EXISTS volunteer_certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  certificate_no text UNIQUE NOT NULL,
  volunteer_name text NOT NULL,
  email text NOT NULL,
  phone text,
  volunteer_type text NOT NULL,
  hours_contributed integer NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  achievements text,
  supervisor_name text NOT NULL,
  certificate_type text NOT NULL,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read volunteer certificates"
  ON volunteer_certificates
  FOR SELECT
  TO public
  USING (true);

-- Create appointment_letters table
CREATE TABLE IF NOT EXISTS appointment_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  letter_no text UNIQUE NOT NULL,
  member_id text NOT NULL,
  position text NOT NULL,
  appointment_date date NOT NULL,
  terms text,
  qr_code_url text,
  issued_by text NOT NULL,
  status text DEFAULT 'active' CHECK (status IN ('active', 'revoked')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE appointment_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read appointment letters"
  ON appointment_letters
  FOR SELECT
  TO public
  USING (true);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  event_date date NOT NULL,
  location text NOT NULL,
  images text[] DEFAULT '{}',
  youtube_links text[] DEFAULT '{}',
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
  created_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read events"
  ON events
  FOR SELECT
  TO public
  USING (true);

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  objectives text[] DEFAULT '{}',
  status text DEFAULT 'active' CHECK (status IN ('active', 'completed', 'paused')),
  start_date date NOT NULL,
  end_date date,
  budget numeric,
  images text[] DEFAULT '{}',
  documents text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read projects"
  ON projects
  FOR SELECT
  TO public
  USING (true);

-- Create member_problems table
CREATE TABLE IF NOT EXISTS member_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  member_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  problem_description text NOT NULL,
  category text NOT NULL,
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status text DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved')),
  assigned_to text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE member_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read member problems"
  ON member_problems
  FOR SELECT
  TO public
  USING (true);

-- Create audit_reports table
CREATE TABLE IF NOT EXISTS audit_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  year integer NOT NULL,
  title text NOT NULL,
  description text NOT NULL,
  report_url text NOT NULL,
  uploaded_by text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE audit_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read audit reports"
  ON audit_reports
  FOR SELECT
  TO public
  USING (true);

-- Create management_team table
CREATE TABLE IF NOT EXISTS management_team (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  position text NOT NULL,
  bio text NOT NULL,
  image_url text,
  email text NOT NULL,
  phone text,
  order_index integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE management_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read management team"
  ON management_team
  FOR SELECT
  TO public
  USING (true);

-- Create website_content table
CREATE TABLE IF NOT EXISTS website_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section text NOT NULL,
  content_key text NOT NULL,
  content_value text NOT NULL,
  language text DEFAULT 'en' CHECK (language IN ('en', 'hi')),
  updated_by text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read website content"
  ON website_content
  FOR SELECT
  TO public
  USING (true);