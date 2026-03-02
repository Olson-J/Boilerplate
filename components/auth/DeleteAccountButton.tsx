"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createSupabaseClient } from "@/lib/supabase/client";

type DeleteState = {
  loading: boolean;
  error?: string;
  showConfirm: boolean;
};

/**
 * Button component for deleting user account.
 * Shows confirmation dialog before deletion.
 * 
 * Calls server-side API route that uses admin privileges to delete the user.
 * The deletion cascades to automatically delete the user's profile.
 */
export const DeleteAccountButton = () => {
  const [state, setState] = useState<DeleteState>({
    loading: false,
    showConfirm: false,
  });
  const router = useRouter();

  const handleDeleteClick = () => {
    setState({ ...state, showConfirm: true });
  };

  const handleCancel = () => {
    setState({ loading: false, showConfirm: false, error: undefined });
  };

  const handleConfirmDelete = async () => {
    setState({ ...state, loading: true, error: undefined });

    try {
      const supabase = createSupabaseClient();

      // Get current user to verify authentication
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setState({
          loading: false,
          showConfirm: true,
          error: "Not authenticated",
        });
        return;
      }

      // Call server-side API to delete account
      // This uses the service role key server-side for security
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      if (!response.ok) {
        const data = await response.json();
        setState({
          loading: false,
          showConfirm: true,
          error: data.error || "Failed to delete account",
        });
        return;
      }

      // Sign out the user (session cleanup)
      await supabase.auth.signOut();

      // Redirect to login with success message
      router.push("/login?message=Account deleted successfully");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete account";
      setState({
        loading: false,
        showConfirm: true,
        error: errorMessage,
      });
    }
  };

  if (!state.showConfirm) {
    return (
      <div className="border-t border-slate-200 pt-6">
        <h3 className="text-sm font-semibold text-slate-900 mb-2">
          Danger Zone
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <Button
          type="button"
          variant="danger"
          onClick={handleDeleteClick}
        >
          Delete Account
        </Button>
      </div>
    );
  }

  return (
    <div className="border-t border-slate-200 pt-6">
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <h3 className="text-sm font-semibold text-red-900 mb-2">
          Are you sure?
        </h3>
        <p className="text-sm text-red-700 mb-4">
          This will permanently delete your account and all associated data.
          This action cannot be undone.
        </p>
        {state.error && (
          <p className="text-sm text-red-600 mb-4" role="alert">
            {state.error}
          </p>
        )}
        <div className="flex gap-3">
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirmDelete}
            loading={state.loading}
            loadingLabel="Deleting..."
          >
            Confirm Delete
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={handleCancel}
            disabled={state.loading}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
