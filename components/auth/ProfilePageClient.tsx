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

      if (userError) {
        // Check if it's a network error
        if (userError.message.toLowerCase().includes('network') || 
            userError.message.toLowerCase().includes('failed') ||
            userError.message.toLowerCase().includes('offline')) {
          setState({ loading: false, error: "Network error. Please check your connection and try again." });
        } else {
          setState({ loading: false, error: userError.message });
        }
        return;
      }

      if (!user) {
        setState({ loading: false, error: "Not authenticated" });
        return;
      }

      // Update profile
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ full_name: fullName, bio })
        .eq("id", user.id);

      if (updateError) {
        // Check if it's a network error
        if (updateError.message.toLowerCase().includes('network') || 
            updateError.message.toLowerCase().includes('failed') ||
            updateError.message.toLowerCase().includes('offline')) {
          setState({ loading: false, error: "Network error. Please check your connection and try again." });
        } else {
          setState({ loading: false, error: "Failed to update profile" });
        }
        return;
      }

      setState({ loading: false, success: "Profile updated successfully!" });
      
      // Refresh the page to show updated data
      router.refresh();
    } catch (err) {
      // Handle network errors from catch block
      const errorMessage = err instanceof Error ? err.message : "An unexpected error occurred";
      if (errorMessage.toLowerCase().includes('network') || 
          errorMessage.toLowerCase().includes('failed') ||
          errorMessage.toLowerCase().includes('offline')) {
        setState({ loading: false, error: "Network error. Please check your connection and try again." });
      } else {
        setState({ loading: false, error: errorMessage });
      }
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
