-- Create table for guest submissions
create table if not exists public.guest_submissions (
  id uuid not null default gen_random_uuid (),
  contest_id text not null,
  guest_name text not null,
  guest_email text not null,
  guest_phone text null,
  score numeric not null default 0,
  total_questions integer not null default 0,
  answers jsonb not null default '{}'::jsonb,
  cheating_flags jsonb null default '{}'::jsonb,
  submitted_at timestamp with time zone not null default now(),
  constraint guest_submissions_pkey primary key (id)
);

-- Add RLS policies (optional, but good practice)
alter table public.guest_submissions enable row level security;

-- Allow anyone (anon) to insert specific fields
create policy "Allow public insert to guest_submissions"
  on public.guest_submissions
  for insert
  with check (true);

-- Allow public to select their own submission (if needed, usually by ID)
create policy "Allow public select guest_submissions by id"
  on public.guest_submissions
  for select
  using (true);
