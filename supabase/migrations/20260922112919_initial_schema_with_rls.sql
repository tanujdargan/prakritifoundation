-- Prakriti Foundation — initial schema (project nheeyglhwaofxhwgkawm).
-- RLS is correct from the start: no table holding donor or member personal
-- data is readable by the anon role. Only genuinely public content is.
--
-- Only the seven tables the application actually queries are created. The
-- original Bolt schema had fifteen; the other eight were never referenced by
-- any code, and `staff` additionally stored its own password_hash, which is
-- redundant and a liability now that Supabase Auth handles logins.

create table if not exists members (
  id uuid primary key default gen_random_uuid(),
  member_id text unique not null, name text not null, email text not null,
  phone text not null, address text not null, membership_type text not null,
  status text default 'active' check (status in ('active','blocked','inactive')),
  membership_fee_paid boolean default false, bank_details text,
  qr_code_url text, coordinator_id text,
  created_at timestamptz default now(), updated_at timestamptz default now()
);

create table if not exists donation_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_no text unique not null, date date not null,
  payment_method text not null, donator_name text not null,
  amount numeric not null check (amount > 0), amount_in_words text not null,
  pan_number text, aadhar_number text, received_by text not null,
  created_at timestamptz default now()
);

create table if not exists volunteer_certificates (
  id uuid primary key default gen_random_uuid(),
  certificate_no text unique not null, volunteer_name text not null,
  email text not null, phone text, volunteer_type text not null,
  hours_contributed integer not null, start_date date not null,
  end_date date not null, achievements text, supervisor_name text not null,
  certificate_type text not null, status text default 'generated',
  created_at timestamptz default now()
);

create table if not exists appointment_letters (
  id uuid primary key default gen_random_uuid(),
  letter_no text unique not null, member_id text not null,
  position text not null, appointment_date date not null, terms text,
  qr_code_url text, issued_by text not null,
  status text default 'active' check (status in ('active','revoked')),
  created_at timestamptz default now()
);

create table if not exists adoptable_animals (
  id uuid primary key default gen_random_uuid(),
  name text not null, species text not null default 'Dog', age text,
  gender text, location text, description text not null,
  image_url text not null, vaccinated boolean default false,
  sterilized boolean default false,
  status text default 'available' check (status in ('available','pending','adopted')),
  sort_order int default 0, created_at timestamptz default now()
);

create table if not exists success_stories (
  id uuid primary key default gen_random_uuid(),
  name text not null, location text, story_date text,
  before_image_url text, after_image_url text not null, story text not null,
  sort_order int default 0, created_at timestamptz default now()
);

alter table members                enable row level security;
alter table donation_receipts      enable row level security;
alter table volunteer_certificates enable row level security;
alter table appointment_letters    enable row level security;
alter table adoptable_animals      enable row level security;
alter table success_stories        enable row level security;

create policy "staff read members"   on members for select to authenticated using (true);
create policy "staff write members"  on members for all    to authenticated using (true) with check (true);
create policy "staff read receipts"  on donation_receipts for select to authenticated using (true);
create policy "staff write receipts" on donation_receipts for all    to authenticated using (true) with check (true);
create policy "staff read certs"     on volunteer_certificates for select to authenticated using (true);
create policy "staff write certs"    on volunteer_certificates for all    to authenticated using (true) with check (true);
create policy "staff read letters"   on appointment_letters for select to authenticated using (true);
create policy "staff write letters"  on appointment_letters for all    to authenticated using (true) with check (true);

create policy "public read animals"  on adoptable_animals for select to public using (true);
create policy "staff write animals"  on adoptable_animals for all    to authenticated using (true) with check (true);
create policy "public read stories"  on success_stories for select to public using (true);
create policy "staff write stories"  on success_stories for all    to authenticated using (true) with check (true);

-- A donor who has already transferred money generates their own receipt. They
-- must be able to CREATE a row and learn its number without being able to read
-- anybody else's. SECURITY DEFINER is the only way to get both: it bypasses
-- RLS for the insert, returns just the new number, and exposes no read path.
-- The sequence also removes the race in read-last-and-increment.
create sequence if not exists donation_receipt_no_seq start 1;

create or replace function public.create_donation_receipt(
  p_date date, p_payment_method text, p_donator_name text,
  p_amount numeric, p_amount_in_words text, p_received_by text,
  p_pan_number text default null, p_aadhar_number text default null
) returns text
language plpgsql security definer set search_path = public
as $$
declare v_receipt_no text;
begin
  if p_amount is null or p_amount <= 0 then
    raise exception 'amount must be greater than zero';
  end if;
  if coalesce(trim(p_donator_name), '') = '' then
    raise exception 'donor name is required';
  end if;

  v_receipt_no := 'PF-' || lpad(nextval('donation_receipt_no_seq')::text, 6, '0');

  insert into donation_receipts (receipt_no, date, payment_method, donator_name,
    amount, amount_in_words, pan_number, aadhar_number, received_by)
  values (v_receipt_no, p_date, p_payment_method, p_donator_name, p_amount,
    p_amount_in_words, nullif(trim(p_pan_number), ''),
    nullif(trim(p_aadhar_number), ''), p_received_by);

  return v_receipt_no;
end;
$$;

revoke all on function public.create_donation_receipt(date,text,text,numeric,text,text,text,text) from public;
grant execute on function public.create_donation_receipt(date,text,text,numeric,text,text,text,text) to anon, authenticated;
