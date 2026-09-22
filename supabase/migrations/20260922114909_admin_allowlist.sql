-- Being signed in is not the same as being staff.
--
-- The previous policies granted access to any `authenticated` role, which is
-- only safe while public sign-ups are disabled — one dashboard toggle standing
-- between a stranger and every donor's PAN number. This replaces that proxy
-- with an explicit allowlist, so holding an account grants nothing by itself
-- and the toggle becomes defence in depth rather than the only defence.

create table if not exists admin_users (
  user_id  uuid primary key references auth.users(id) on delete cascade,
  email    text not null,
  added_at timestamptz default now()
);

alter table admin_users enable row level security;

-- SECURITY DEFINER so the check can read the allowlist without tripping the
-- RLS it is being used to enforce, which would recurse.
create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from admin_users where user_id = auth.uid()); $$;

revoke all on function public.is_admin() from public, anon;
grant execute on function public.is_admin() to authenticated;

create policy "admins read allowlist" on admin_users for select to authenticated using (public.is_admin());

drop policy if exists "staff read members"   on members;
drop policy if exists "staff write members"  on members;
drop policy if exists "staff read receipts"  on donation_receipts;
drop policy if exists "staff write receipts" on donation_receipts;
drop policy if exists "staff read certs"     on volunteer_certificates;
drop policy if exists "staff write certs"    on volunteer_certificates;
drop policy if exists "staff read letters"   on appointment_letters;
drop policy if exists "staff write letters"  on appointment_letters;

create policy "admins read members"   on members                for select to authenticated using (public.is_admin());
create policy "admins write members"  on members                for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read receipts"  on donation_receipts      for select to authenticated using (public.is_admin());
create policy "admins write receipts" on donation_receipts      for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read certs"     on volunteer_certificates for select to authenticated using (public.is_admin());
create policy "admins write certs"    on volunteer_certificates for all    to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins read letters"   on appointment_letters    for select to authenticated using (public.is_admin());
create policy "admins write letters"  on appointment_letters    for all    to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public content stays world-readable, but only admins may change it —
-- otherwise any signed-up stranger could publish photos to the live site.
drop policy if exists "staff write animals" on adoptable_animals;
drop policy if exists "staff write stories" on success_stories;

create policy "admins write animals" on adoptable_animals for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins write stories" on success_stories   for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "staff upload content bucket" on storage.objects;
drop policy if exists "staff update content bucket" on storage.objects;
drop policy if exists "staff delete content bucket" on storage.objects;

create policy "admins upload content bucket" on storage.objects for insert to authenticated with check (bucket_id = 'content' and public.is_admin());
create policy "admins update content bucket" on storage.objects for update to authenticated using (bucket_id = 'content' and public.is_admin()) with check (bucket_id = 'content' and public.is_admin());
create policy "admins delete content bucket" on storage.objects for delete to authenticated using (bucket_id = 'content' and public.is_admin());
