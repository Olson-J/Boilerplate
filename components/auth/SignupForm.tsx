"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

type SignupFormValues = {
  email: string;
  password: string;
  confirmPassword: string;
};

type SignupFormProps = {
  /**
   * Form submit handler.
   */
  onSubmit: (values: SignupFormValues) => void | Promise<void>;
  /**
   * Optional loading state.
   */
  loading?: boolean;
  /**
   * Optional error message.
   */
  error?: string;
};

/**
 * Signup form for email/password registration.
 */
export const SignupForm = ({
  onSubmit,
  loading = false,
  error,
}: SignupFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit({ email, password, confirmPassword });
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading} error={error}>
      <Input
        id="signup-email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        required
      />
      <Input
        id="signup-password"
        label="Password"
        type="password"
        autoComplete="new-password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        required
      />
      <Input
        id="signup-confirm-password"
        label="Confirm password"
        type="password"
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.currentTarget.value)}
        required
      />
      <Button type="submit" loading={loading} loadingLabel="Creating account">
        Create account
      </Button>
    </Form>
  );
};
