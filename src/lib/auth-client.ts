import { createAuthClient } from "better-auth/react";
import { jwtClient } from "better-auth/client/plugins";
import type { BetterAuthOptions } from "better-auth";

const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "/api/auth",
  plugins: [
    jwtClient({
      jwks: {
        jwksPath: "/jwks",
      },
    }),
  ],
  $InferAuth: {
    emailAndPassword: {
      enabled: true,
    },
    user: {
      additionalFields: {
        role: {
          type: "string",
          required: false,
          defaultValue: "user",
        },
        phone: {
          type: "string",
          required: false,
        },
        bio: {
          type: "string",
          required: false,
        },
      },
    },
  } as unknown as BetterAuthOptions,
});

export const { signIn, signUp, useSession } = authClient;
export { authClient };
