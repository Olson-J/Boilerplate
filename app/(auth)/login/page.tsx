"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/LoginForm";

type LoginState = {
  loading: boolean;
  error?: string;
};

export default function LoginPage() {
  const [state, setState] = useState<LoginState>({ loading: false });

  const handleSubmit = async () => {
    setState({ loading: true });
    setState({ loading: false });
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
