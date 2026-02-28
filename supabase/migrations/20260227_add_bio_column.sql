-- Add bio column to profiles table
alter table public.profiles add column bio text;

-- Add check constraint for bio length (max 160 characters)
alter table public.profiles add constraint bio_length_check check (char_length(bio) <= 160);
