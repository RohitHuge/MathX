-- Safely create the storage bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('payment-screenshots', 'payment-screenshots', true)
on conflict (id) do nothing;

-- Drop existing policies to avoid conflicts
drop policy if exists "Public Uploads" on storage.objects;
drop policy if exists "Public Access" on storage.objects;

-- Policy to allow anyone to upload files (since registration is public)
create policy "Public Uploads"
on storage.objects for insert
with check ( bucket_id = 'payment-screenshots' );

-- Policy to allow anyone to view the uploaded files (for verification)
create policy "Public Access"
on storage.objects for select
using ( bucket_id = 'payment-screenshots' );
