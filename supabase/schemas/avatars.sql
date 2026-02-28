-- Storage Schema: Avatars Bucket
-- This file defines the avatars storage bucket and its RLS policies

-- Create avatars bucket (public = true allows public read access via URLs)
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- RLS Policies for avatars bucket

-- Allow authenticated users to upload to their own folder
create policy "Users can upload own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to update their own avatars
create policy "Users can update own avatar"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own avatars
create policy "Users can delete own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow public read access (avatars are public)
create policy "Public avatar access"
on storage.objects
for select
to public
using (bucket_id = 'avatars');
