"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { uploadAvatar } from "@/lib/utils/uploadAvatar";
import { createSupabaseClient } from "@/lib/supabase/client";

const MAX_FULL_NAME_LENGTH = 100;
const MAX_BIO_LENGTH = 160;

type ProfileFormValues = {
  fullName: string;
  bio: string;
  avatarFile: File | null;
};

type ProfileFormProps = {
  /**
   * Initial full name value.
   */
  initialFullName?: string;
  /**
   * Initial bio value.
   */
  initialBio?: string;
  /**
   * Submit handler for profile updates.
   */
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  /**
   * Optional loading state.
   */
  loading?: boolean;
  /**
   * Optional error message.
   */
  error?: string;
  /**
   * Optional success message.
   */
  success?: string;
};

/**
 * Profile form for updating name, bio, and avatar.
 */
export const ProfileForm = ({
  initialFullName = "",
  initialBio = "",
  onSubmit,
  loading = false,
  error,
  success,
}: ProfileFormProps) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [bio, setBio] = useState(initialBio);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.currentTarget.files ?? [];
    setAvatarFile(file ?? null);
    setUploadError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError("");
    setValidationError("");

    // Validate full name length
    if (fullName.length > MAX_FULL_NAME_LENGTH) {
      setValidationError(`Full name must be ${MAX_FULL_NAME_LENGTH} characters or less`);
      return;
    }

    // Validate bio length
    if (bio.length > MAX_BIO_LENGTH) {
      setValidationError(`Bio must be ${MAX_BIO_LENGTH} characters or less`);
      return;
    }

    // If there's an avatar file to upload
    if (avatarFile) {
      const supabase = createSupabaseClient();

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUploadError("Not authenticated");
        return;
      }

      // Upload avatar
      const result = await uploadAvatar(avatarFile, user.id);

      if (result.error) {
        setUploadError(result.error);
        return;
      }

      // Update profile with avatar URL
      if (result.url) {
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ avatar_url: result.url })
          .eq("id", user.id);

        if (updateError) {
          setUploadError("Failed to save avatar URL");
          return;
        }
      }
    }

    onSubmit({ fullName, bio, avatarFile });
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading} error={error || uploadError || validationError}>
      <Input
        id="profile-full-name"
        label="Full name"
        type="text"
        maxLength={MAX_FULL_NAME_LENGTH}
        value={fullName}
        onChange={(event) => setFullName(event.currentTarget.value)}
      />
      <div className="text-xs text-slate-500">{fullName.length}/{MAX_FULL_NAME_LENGTH}</div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="profile-bio">
          Bio
        </label>
        <textarea
          id="profile-bio"
          maxLength={MAX_BIO_LENGTH}
          value={bio}
          onChange={(event) => setBio(event.currentTarget.value)}
          placeholder="Tell us about yourself..."
          rows={4}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <div className="text-xs text-slate-500">{bio.length}/{MAX_BIO_LENGTH}</div>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium text-slate-700" htmlFor="profile-avatar">
          Avatar
        </label>
        <input
          id="profile-avatar"
          type="file"
          accept="image/*"
          onChange={handleAvatarChange}
          className="block w-full text-sm text-slate-600 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
        />
      </div>
      {success ? <p className="text-sm text-emerald-600">{success}</p> : null}
      <Button type="submit" loading={loading} loadingLabel="Saving">
        Save profile
      </Button>
    </Form>
  );
};
