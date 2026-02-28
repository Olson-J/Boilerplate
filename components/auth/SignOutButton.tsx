"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";

type SignOutButtonProps = {
  className?: string;
};

export const SignOutButton = ({ className }: SignOutButtonProps) => {
  const { signOut, loading } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <Button
      type="button"
      variant="secondary"
      loading={loading}
      loadingLabel="Signing out"
      className={className}
      onClick={() => {
        void handleSignOut();
      }}
    >
      Sign out
    </Button>
  );
};
