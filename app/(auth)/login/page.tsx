"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";
import { createSupabaseClient } from "@/lib/supabase/client";

type LoginState = {
  loading: boolean;
  error?: string;
};

export default function LoginPage() {
  const [state, setState] = useState<LoginState>({ loading: false });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setState({ loading: true });

    const supabase = createSupabaseClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      setState({ loading: false, error: error.message });
      return;
    }

    window.location.assign("/dashboard");
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <Card title="Log in to your account" description="Welcome back.">
          <LoginForm onSubmit={handleSubmit} loading={state.loading} error={state.error} />
        </Card>
      </div>
    </main>
  );
}
