import { authClient } from "@/lib/auth-client";

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  role?: string;
  phone?: string;
  bio?: string;
  credits?: number;
  createdAt: string | Date;
  updatedAt: string | Date;
};

export const accessUser = async (): Promise<UserProfile | null> => {
  try {
    const result = await authClient.getSession();
    if (result.error || !result.data) {
      return null;
    }

    return result?.data?.user ?? null;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return null;
  }
};

export const accessToken = async (): Promise<string | null> => {
  try {
    const result = await authClient.token();
    if (result.error || !result.data) {
      return null;
    }

    return result.data.token ?? null;
  } catch (error) {
    console.error("Failed to fetch token:", error);
    return null;
  }
};

export const getToken = accessToken;
