import {
  adminClient,
  apiKeyClient,
  organizationClient
} from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
// import { toast } from "sonner";

export const authClient = createAuthClient({
  // Domain Configurations
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,

  plugins: [adminClient(), apiKeyClient(), organizationClient()],
  fetchOptions: {
    onError: (ctx) => {
      // toast.error(`BetterAuth Error: ${ctx.error.message}`);
      console.error("BetterAuth Error:", ctx.error.message);
    },
    credentials: "include"
  }
});
