"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Form } from "@/components/ui/Form";
import { Input } from "@/components/ui/Input";

type LoginFormValues = {
  email: string;
  password: string;
};

type LoginFormProps = {
  /**
   * Form submit handler.
   */
  onSubmit: (values: LoginFormValues) => void | Promise<void>;
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
 * Basic email validation
 */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Login form for email/password authentication.
 */
export const LoginForm = ({ onSubmit, loading = false, error }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validationError, setValidationError] = useState("");

  const isFormValid = email.trim() !== "" && password.trim() !== "";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidationError("");

    // Validate email format
    if (!isValidEmail(email)) {
      setValidationError("Please enter a valid email address");
      return;
    }

    onSubmit({ email, password });
  };

  return (
    <Form onSubmit={handleSubmit} loading={loading} error={error || validationError}>
      <Input
        id="login-email"
        label="Email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.currentTarget.value)}
        required
      />
      <Input
        id="login-password"
        label="Password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(event) => setPassword(event.currentTarget.value)}
        required
      />
      <Button 
        type="submit" 
        loading={loading} 
        loadingLabel="Logging in"
        disabled={!isFormValid || loading}
      >
        Log in
      </Button>
    </Form>
  );
};
