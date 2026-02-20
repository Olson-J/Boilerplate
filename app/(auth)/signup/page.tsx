"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/components/auth/SignupForm";

type SignupState = {
  loading: boolean;
  error?: string;
};

export default function SignupPage() {
  const [state, setState] = useState<SignupState>({ loading: false });

  const handleSubmit = async () => {
    setState({ loading: true });
    setState({ loading: false });
  };

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-16">
      <div className="mx-auto w-full max-w-md">
        <Card title="Create your account" description="Start building today.">
          <SignupForm onSubmit={handleSubmit} loading={state.loading} error={state.error} />
        </Card>
      </div>
    </main>
  );
}
