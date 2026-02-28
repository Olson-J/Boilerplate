"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { createSupabaseClient } from "@/lib/supabase/client";

type ProfilePageClientProps = {
  initialFullName: string;
};

type SubmitState = {
  loading: boolean;
  error?: string;
  success?: string;
};

export const ProfilePageClient = ({ initialFullName }: ProfilePageClientProps) => {
  const [state, setState] = useState<SubmitState>({ loading: false });

  const handleSubmit = async ({ fullName }: { fullName: string }) => {
    setState({ loading: true, error: undefined, success: undefined });

    try {
      const supabase = createSupabaseClient();

      // Get current user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setState({ loading: false, error: "Not authenticated" });
        return;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", user.id);

      if (updateError) {
        setState({ loading: false, error: "Failed to update profile" });
        return;
      }

      setState({ loading: false, success: "Profile updated successfully!" });
    } catch (err) {
      setState({ loading: false, error: "An unexpected error occurred" });
    }
  };

  return (
    <ProfileForm
      initialFullName={initialFullName}
      onSubmit={handleSubmit}
      loading={state.loading}
      error={state.error}
      success={state.success}
    />
  );
};
