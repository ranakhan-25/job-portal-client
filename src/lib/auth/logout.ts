import { authClient } from "@/lib/auth-client";

export const logoutUser = async () => {
  const result = await authClient.signOut();

  if (result.error) {
    throw new Error(result.error.message || "Logout failed.");
  }

  return true;
};
