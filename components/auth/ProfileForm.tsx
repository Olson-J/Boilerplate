"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";
import { uploadAvatar } from "@/lib/utils/uploadAvatar";
import { createClient } from "@/lib/supabase/client";

type ProfileFormValues = {
  fullName: string;
  avatarFile: File | null;
};

type ProfileFormProps = {
  /**
   * Initial full name value.
   */
  initialFullName?: string;
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
 * Profile form for updating name and avatar.
 */
export const ProfileForm = ({
  initialFullName = "",
  onSubmit,
  loading = false,
  error,
  success,
}: ProfileFormProps) => {
  const [fullName, setFullName] = useState(initialFullName);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string>("");

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const [file] = event.currentTarget.files ?? [];
    setAvatarFile(file ?? null);
    setUploadError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setUploadError("");

    // If there's an avatar file to upload
    if (avatarFile) {
      const supabase = createClient();

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

    onSubmit({ fullName, avatarFile });
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading} error={error || uploadError}>
      <Input
        id="profile-full-name"
        label="Full name"
        type="text"
        value={fullName}
        onChange={(event) => setFullName(event.currentTarget.value)}
      />
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
