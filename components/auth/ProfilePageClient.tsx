"use client";

import { useState } from "react";
import { ProfileForm } from "@/components/auth/ProfileForm";

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

  const handleSubmit = async () => {
    setState({ loading: true });
    setState({ loading: false, success: "Profile updated." });
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
