"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ProfileForm } from "@/components/auth/ProfileForm";
import { createSupabaseClient } from "@/lib/supabase/client";

type ProfilePageClientProps = {
  initialFullName: string;
  initialBio: string;
};

type SubmitState = {
  loading: boolean;
  error?: string;
  success?: string;
};

export const ProfilePageClient = ({ initialFullName, initialBio }: ProfilePageClientProps) => {
  const [state, setState] = useState<SubmitState>({ loading: false });
  const router = useRouter();

  const handleSubmit = async ({ fullName, bio }: { fullName: string; bio: string }) => {
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
        .update({ full_name: fullName, bio })
        .eq("id", user.id);

      if (updateError) {
        setState({ loading: false, error: "Failed to update profile" });
        return;
      }

      setState({ loading: false, success: "Profile updated successfully!" });
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      setState({ loading: false, error: "An unexpected error occurred" });
    }
  };

  return (
    <ProfileForm
      initialFullName={initialFullName}
      initialBio={initialBio}
      onSubmit={handleSubmit}
      loading={state.loading}
      error={state.error}
      success={state.success}
    />
  );
};
