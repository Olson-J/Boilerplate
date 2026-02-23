"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/components/auth/SignupForm";
import { createSupabaseClient } from "@/lib/supabase/client";

type SignupState = {
  loading: boolean;
  error?: string;
  success?: string;
};

export default function SignupPage() {
  const [state, setState] = useState<SignupState>({ loading: false });

  const handleSubmit = async (values: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      setState({ loading: false, error: "Passwords do not match." });
      return;
    }

    setState({ loading: true });

    const supabase = createSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setState({ loading: false, error: error.message });
      return;
    }

    if (data.session) {
      window.location.assign("/dashboard");
      return;
    }

    setState({
      loading: false,
      success: "Account created. Please check your email to confirm.",
    });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <Card title="Create your account" description="Start building today.">
          <SignupForm onSubmit={handleSubmit} loading={state.loading} error={state.error} />
          {state.success ? (
            <p className="mt-4 text-sm text-emerald-600" role="status">
              {state.success}
            </p>
          ) : null}
        </Card>
      </div>
    </main>
  );
}
