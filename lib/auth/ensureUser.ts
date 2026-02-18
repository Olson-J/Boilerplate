export type AuthUser = {
  id: string;
  email?: string | null;
};

/**
 * Ensures a user is present, otherwise throws an authentication error.
 */
export function ensureUser(user: AuthUser | null): AuthUser {
  if (!user) {
    throw new Error("User not authenticated");
  }
  return user;
}
