"use client";

import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";

type SignOutButtonProps = {
  className?: string;
};

export const SignOutButton = ({ className }: SignOutButtonProps) => {
  const { signOut, loading } = useAuth();

  return (
    <Button
      type="button"
      variant="secondary"
      loading={loading}
      loadingLabel="Signing out"
      className={className}
      onClick={() => {
        void signOut();
      }}
    >
      Sign out
    </Button>
  );
};
