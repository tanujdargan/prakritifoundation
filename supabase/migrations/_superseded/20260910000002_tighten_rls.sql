/*
  # Tighten RLS on Sensitive Tables

  ==========================================================================
  DO NOT APPLY THIS MIGRATION UNTIL THE FOLLOWING IS VERIFIED ON THE LIVE
  SUPABASE PROJECT:

  `src/components/DonationReceipt.tsx` performs an INSERT into
  `donation_receipts`, but the original migration
  (20250917221734_dark_scene.sql) defines ONLY a SELECT policy
  ("Anyone can read donation receipts") on that table — there is NO INSERT
  policy for any role. That means either:

    (a) an INSERT policy was added by hand in the Supabase dashboard and is
        not reflected anywhere in this migrations folder, in which case
        this file will NOT touch it (it only changes SELECT), or
    (b) no such policy exists, and receipt saving from the admin dashboard
        has been silently failing (Postgres RLS blocks writes with no
        matching policy) every time someone has tried to use it.

  Before running this migration, open the Supabase dashboard for the real
  project, check Database > Policies on `donation_receipts`, and confirm
  which case applies. If it is case (b), add an INSERT policy (scoped to
  `authenticated`) before or alongside this migration, and separately test
  that generating a donation receipt in the admin panel actually persists
  a row. Do not assume this migration alone makes receipt saving work.
  ==========================================================================

  2. Problem
    The original migration granted `FOR SELECT TO public USING (true)` on
    several tables that hold personally identifiable and sensitive
    information (donor PAN/Aadhaar numbers, member phone/email/home
    addresses, volunteer contact details, appointment records). Because
    the site's anon key ships inside the client bundle, any visitor could
    read these rows directly via the Supabase REST API without ever using
    the website's own UI.

  3. Changes
    Replace the public SELECT policy with an authenticated-only SELECT
    policy (same policy name, so no application code needs to change) on:
      - `donation_receipts`
      - `members`
      - `member_problems`
      - `volunteer_certificates`
      - `appointment_letters`

    The following tables are genuinely public marketing/reporting content
    and are intentionally left untouched:
      - `audit_reports`
      - `events`
      - `projects`
      - `management_team`
      - `website_content`
      - `organization_awards`
*/

DROP POLICY IF EXISTS "Anyone can read donation receipts" ON donation_receipts;

CREATE POLICY "Anyone can read donation receipts"
  ON donation_receipts
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read members" ON members;

CREATE POLICY "Anyone can read members"
  ON members
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read member problems" ON member_problems;

CREATE POLICY "Anyone can read member problems"
  ON member_problems
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read volunteer certificates" ON volunteer_certificates;

CREATE POLICY "Anyone can read volunteer certificates"
  ON volunteer_certificates
  FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Anyone can read appointment letters" ON appointment_letters;

CREATE POLICY "Anyone can read appointment letters"
  ON appointment_letters
  FOR SELECT
  TO authenticated
  USING (true);
