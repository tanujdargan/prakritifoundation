-- Public bucket for photos the team uploads through the admin Content tab.
-- Images are meant to be world-readable (they appear on the public site);
-- only signed-in staff may write or delete. The write policies are narrowed
-- further to the admin allowlist in the next migration.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('content', 'content', true, 10485760,
        array['image/jpeg','image/png','image/webp','image/gif'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "public read content bucket"  on storage.objects;
drop policy if exists "staff upload content bucket" on storage.objects;
drop policy if exists "staff update content bucket" on storage.objects;
drop policy if exists "staff delete content bucket" on storage.objects;

create policy "public read content bucket"  on storage.objects for select to public        using (bucket_id = 'content');
create policy "staff upload content bucket" on storage.objects for insert to authenticated with check (bucket_id = 'content');
create policy "staff update content bucket" on storage.objects for update to authenticated using (bucket_id = 'content') with check (bucket_id = 'content');
create policy "staff delete content bucket" on storage.objects for delete to authenticated using (bucket_id = 'content');
