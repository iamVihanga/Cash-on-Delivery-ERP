import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import { type Database } from "../database";
import * as authSchema from "../database/schema/auth.schema";
import { admin, openAPI } from "better-auth/plugins";

export interface AuthConfigurations {
  database: Database;
  secret?: string;
  plugins?: Parameters<typeof betterAuth>[0]["plugins"];
}

export function configAuth(config: AuthConfigurations) {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  const baseAuthInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
      "https://wisby2.donext.org",
      "https://wisby2api.donext.org",
      "http://localhost:3000",
      "http://localhost:4000",
      // "https://bunplate-web.vercel.app",
      // "https://bunplate-api.vercel.app",
    ],

    database: drizzleAdapter(config.database, {
      provider: "pg",
      schema: authSchema,
      usePlural: true
    }),
    secret: config.secret,
    plugins: [admin(), openAPI(), ...(config.plugins || [])],

    emailAndPassword: {
      enabled: true
    },

    advanced: {
      cookies: {
        session_token: {
          attributes: {
            sameSite: "none",
            secure: true,
            httpOnly: true
          }
        }
      },
      // Enable cross-subdomain cookies for Vercel deployment
      crossSubDomainCookies: isProduction
        ? {
            enabled: true,
            domain: ".donext.org" // Share cookies across *.vercel.app subdomains
          }
        : undefined,
      defaultCookieAttributes: {
        sameSite: "none", // Use lax for cross-subdomain, none for local dev
        secure: true,
        httpOnly: true,
        partitioned: true // New browser standards will mandate this for foreign cookies
      }
    }
  });

  return baseAuthInstance;
}

export type AuthInstance = ReturnType<typeof configAuth>;

export type Session = AuthInstance["$Infer"]["Session"]