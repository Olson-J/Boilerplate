-- Create avatars storage bucket if it doesn't exist
insert into storage.buckets (id, name, owner, public, file_size_limit)
values ('avatars', 'avatars', null, true, 5242880) -- 5MB
on conflict (id) do nothing;

-- Allow anyone to upload their own avatar
create policy "Users can upload their own avatar" on storage.objects
  for insert
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow anyone to view avatars
create policy "Avatars are public" on storage.objects
  for select
  using (bucket_id = 'avatars');

-- Allow users to update their own avatar
create policy "Users can update their own avatar" on storage.objects
  for update
  with check (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );

-- Allow users to delete their own avatar
create policy "Users can delete their own avatar" on storage.objects
  for delete
  using (
    bucket_id = 'avatars' and
    (storage.foldername(name))[1] = auth.uid()::text
  );
