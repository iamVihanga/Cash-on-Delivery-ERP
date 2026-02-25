# API Performance Optimization Plan

## Overview

This document outlines strategies to reduce API request latency from ~300ms to <100ms for the Vercel-deployed Hono.js API.

**Current Performance**: ~300ms average latency  
**Target Performance**: <100ms average latency  
**Primary Bottlenecks**: Cold starts, database connection overhead, middleware initialization

---

## 1. Switch to Vercel Edge Runtime (Biggest Impact)

Vercel Edge Functions have near-zero cold starts vs ~250ms for Node.js serverless functions.

### Implementation

Update `/apps/api/index.ts`:

```typescript
import { handle } from "hono/vercel";
import app from "./src/app";

// Switch from Node.js serverless to Edge runtime
export const runtime = "edge";

export default handle(app);
```

### Compatibility Check

⚠️ **Important**: Edge Runtime has limitations:

- No native Node.js APIs (fs, child_process, etc.)
- No WebSocket server support
- Must use Edge-compatible dependencies

Since this project uses `@neondatabase/serverless`, it should be Edge-compatible. However, if you're using `ws` or other Node.js-only packages, skip this optimization.

### Vercel Configuration Update

Update `/apps/api/vercel.json`:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/api"
    }
  ],
  "functions": {
    "api/**": {
      "maxDuration": 10,
      "memory": 256
    }
  },
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, s-maxage=0, stale-while-revalidate=59"
        }
      ]
    }
  ]
}
```

**Expected Savings**: 100-200ms on cold starts

---

## 2. Use Neon Serverless HTTP Driver

The biggest latency killer in serverless is TCP connection establishment to PostgreSQL (~100ms). Neon's HTTP driver eliminates this overhead.

### Implementation

Update `/packages/core/src/database/index.ts`:

```typescript
import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle as drizzleNeonHttp } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Enable fetch connection caching - reuses connections across requests
neonConfig.fetchConnectionCache = true;

export type Database = ReturnType<typeof initDatabase>;

export function initDatabase(connectionString: string) {
  // Use HTTP-based driver for serverless - no TCP connection overhead
  const sql = neon(connectionString);

  const db = drizzleNeonHttp(sql, {
    schema,
    logger: false // Disable logger in production for performance
  });

  return db;
}
```

### Dependencies

Ensure you have the correct packages in `/packages/core/package.json`:

```json
{
  "dependencies": {
    "@neondatabase/serverless": "^1.0.2",
    "drizzle-orm": "^0.39.0"
  }
}
```

**Expected Savings**: 80-120ms per database query

---

## 3. Lazy-Load Auth & Database Per-Request

Instead of initializing everything at module-level (which runs every cold start), use lazy initialization with caching.

### Implementation

Update `/packages/core/src/auth/setup.ts`:

```typescript
import {
  configAuth,
  type AuthConfigurations,
  type AuthInstance
} from "./config";

export type { AuthInstance };

let authInstance: AuthInstance | null = null;
let authConfig: AuthConfigurations | null = null;

/**
 * Sets up the authentication configuration.
 * The actual instance is created lazily on first access.
 */
export function setupAuth(config: AuthConfigurations) {
  authConfig = config;
  // Reset instance so it's recreated with new config
  authInstance = null;
}

/**
 * Gets the initialized authentication instance.
 * Creates it lazily on first access for faster cold starts.
 */
export function getAuth(): AuthInstance {
  if (!authInstance) {
    if (!authConfig) {
      throw new Error("Auth not configured. Call setupAuth() first.");
    }
    authInstance = configAuth(authConfig);
  }
  return authInstance;
}
```

**Expected Savings**: 20-40ms on cold starts

---

## 4. Optimize Auth Config - Remove Unnecessary Plugins

The `openAPI()` plugin adds overhead. Only load it in development.

### Implementation

Update `/packages/core/src/auth/config.ts`:

```typescript
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { betterAuth } from "better-auth";

import { type Database } from "../database";
import * as authSchema from "../database/schema/auth.schema";
import { admin } from "better-auth/plugins";

export interface AuthConfigurations {
  database: Database;
  secret?: string;
  plugins?: Parameters<typeof betterAuth>[0]["plugins"];
}

export function configAuth(config: AuthConfigurations) {
  const isProduction =
    process.env.VERCEL_ENV === "production" ||
    process.env.NODE_ENV === "production";

  // Only load openAPI plugin in development
  const plugins = [admin(), ...(config.plugins || [])];

  if (!isProduction) {
    // Dynamic import to avoid loading in production
    const { openAPI } = require("better-auth/plugins");
    plugins.push(openAPI());
  }

  const baseAuthInstance = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    trustedOrigins: [
      "https://wisby2.donext.org",
      "https://wisby2api.donext.org",
      "http://localhost:3000",
      "http://localhost:4000"
    ],

    database: drizzleAdapter(config.database, {
      provider: "pg",
      schema: authSchema,
      usePlural: true
    }),
    secret: config.secret,
    plugins,

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
      crossSubDomainCookies: isProduction
        ? {
            enabled: true,
            domain: ".donext.org"
          }
        : undefined,
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true,
        httpOnly: true,
        partitioned: true
      }
    }
  });

  return baseAuthInstance;
}

export type AuthInstance = ReturnType<typeof configAuth>;
export type Session = AuthInstance["$Infer"]["Session"];
```

**Expected Savings**: 10-20ms on initialization

---

## 5. Add Compression & Optimized Middleware

### Implementation

Update `/apps/api/src/lib/setup-api.ts`:

```typescript
import { OpenAPIHono } from "@hono/zod-openapi";
import { compress } from "hono/compress";
import { timing } from "hono/timing";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import type { APIBindings } from "../types";

export function setupAPI() {
  const app = new OpenAPIHono<APIBindings>();

  // Server-Timing header for debugging latency
  app.use("*", timing());

  // Compress responses - significant for JSON payloads
  app.use("*", compress());

  // CORS - be specific to avoid preflight overhead
  app.use(
    "*",
    cors({
      origin: ["https://wisby2.donext.org", "http://localhost:3000"],
      allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
      allowHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 86400 // Cache preflight for 24 hours
    })
  );

  // Only log in development
  if (process.env.NODE_ENV === "development") {
    app.use("*", logger());
  }

  return app;
}
```

**Expected Savings**: 10-30ms for large payloads

---

## 6. Add Response Caching Middleware

Create a new middleware for caching GET requests.

### Implementation

Create `/apps/api/src/middlewares/cache.middleware.ts`:

```typescript
import { createMiddleware } from "hono/factory";
import type { APIBindings } from "../types";

/**
 * Cache middleware for GET requests.
 * Sets Cache-Control headers for Vercel Edge Cache.
 *
 * @param maxAge - Cache duration in seconds (default: 0)
 * @param staleWhileRevalidate - Stale-while-revalidate duration (default: 60)
 */
export function cacheControl(maxAge = 0, staleWhileRevalidate = 60) {
  return createMiddleware<APIBindings>(async (c, next) => {
    await next();

    // Only cache successful GET requests
    if (c.req.method === "GET" && c.res.status === 200) {
      c.res.headers.set(
        "Cache-Control",
        `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
      );
      // Add Vercel CDN cache tag
      c.res.headers.set("CDN-Cache-Control", `public, max-age=${maxAge}`);
    }
  });
}
```

### Usage Example

Apply to read-heavy routes in registry files:

```typescript
// Example: /apps/api/src/registry/grade.registry.ts
import { cacheControl } from "../middlewares/cache.middleware";

// For list endpoints that don't change often
app.use("/grades", cacheControl(10, 60)); // Cache 10s, stale 60s
```

**Expected Savings**: Near 0ms for cached responses

---

## 7. Optimize App Initialization

Update `/apps/api/src/app.ts`:

```typescript
import { OpenAPIHono } from "@hono/zod-openapi";
import { Hono } from "hono";

import { initDatabase } from "core/database";
import type { Database } from "core/database";
import { setupAuth } from "core/auth/setup";

import type { APIBindings } from "./types";
import { setupAPI } from "./lib/setup-api";
import { registerRoutes } from "./registry";
import configureOpenAPI from "./lib/open-api-config";

let app: OpenAPIHono<APIBindings>;

try {
  // Initialize database connection - using HTTP driver, no TCP overhead
  const db = initDatabase(process.env.DATABASE_URL!);

  // Configure auth (lazy initialization - doesn't create instance yet)
  setupAuth({
    database: db,
    secret: process.env.BETTER_AUTH_SECRET!
  });

  // Setup app with middleware and routes
  app = registerRoutes(setupAPI());

  // Only configure OpenAPI docs in development
  if (process.env.NODE_ENV !== "production") {
    configureOpenAPI(app);
  }
} catch (error) {
  console.error("Failed to initialize:", error);

  app = new OpenAPIHono<APIBindings>();
  app.all("*", (c) =>
    c.json({ error: "Internal Server Error: Initialization Failed" }, 500)
  );

  throw error;
}

export default app;
```

**Expected Savings**: 15-30ms by skipping OpenAPI config in production

---

## 8. Optimize Vercel Build Configuration

Update `/apps/api/builders/build-vercel.ts`:

```typescript
// In the build function, update the Bun.build configuration:

const result = await Bun.build({
  entrypoints: [resolve(API_ROOT, "index.ts")],
  outdir: DIST,
  target: "node",
  format: "esm",
  splitting: false,
  minify: true, // ← Enable minification for production
  sourcemap: "external",
  external: [
    "hono",
    "hono/*",
    "@hono/zod-openapi",
    "@scalar/hono-api-reference",
    "stoker",
    "@neondatabase/serverless"
    // Remove "ws" if not using WebSocket connections
  ],
  naming: {
    entry: "index.js"
  }
});
```

**Expected Savings**: 10-20ms on cold starts (smaller bundle size)

---

## 9. Optimize Web → API Communication

On the Next.js side, ensure efficient API calls.

### Implementation

Update or create `/apps/web/src/lib/rpc/client.ts`:

```typescript
import { hc } from "hono/client";
import type { Router } from "core/rpc";

const API_URL = process.env.NEXT_PUBLIC_API_URL!;

// Create a single client instance - reuse across requests
export const client = hc<Router>(API_URL, {
  init: {
    credentials: "include"
  }
});

// For server-side calls with caching
export function createCachedClient(revalidate = 60) {
  return hc<Router>(API_URL, {
    fetch: (input, init) =>
      fetch(input, {
        ...init,
        credentials: "include",
        next: { revalidate } // Next.js fetch cache
      })
  });
}
```

---

## 10. Additional Performance Tips

### Database Query Optimization

1. **Use select() to limit columns**:

   ```typescript
   // Bad
   const users = await db.query.users.findMany();

   // Good
   const users = await db
     .select({
       id: users.id,
       name: users.name
     })
     .from(users);
   ```

2. **Add database indexes** for frequently queried columns

3. **Use pagination** for list endpoints:
   ```typescript
   const result = await db.query.users.findMany({
     limit: 50,
     offset: page * 50
   });
   ```

### Monitoring & Debugging

Add the Server-Timing header (already included in setup-api.ts) to track:

- Database query time
- Middleware execution time
- Auth verification time

View in browser DevTools → Network → Timing tab

---

## Performance Expectations

| Optimization                 | Expected Savings               |
| ---------------------------- | ------------------------------ |
| Neon HTTP driver (no TCP)    | **80-120ms**                   |
| Edge Runtime (if compatible) | **100-200ms** cold start       |
| Lazy auth initialization     | **20-40ms**                    |
| Response compression         | **10-30ms** for large payloads |
| CORS preflight caching       | Eliminates duplicate requests  |
| Bundle minification          | **10-20ms** cold start         |
| CDN caching (GET requests)   | **~0ms** for cached responses  |
| Skip OpenAPI in production   | **15-30ms**                    |

### Expected Results

- **Cold start**: 300ms → 80-120ms (Edge) or 150-200ms (Node)
- **Warm requests**: 300ms → 50-100ms
- **Cached GET requests**: 5-20ms via Vercel Edge Cache

---

## Implementation Checklist

- [ ] 1. Update database driver to Neon HTTP
- [ ] 2. Implement lazy auth initialization
- [ ] 3. Add compression middleware
- [ ] 4. Optimize CORS with maxAge
- [ ] 5. Create cache middleware
- [ ] 6. Apply caching to GET routes
- [ ] 7. Skip OpenAPI config in production
- [ ] 8. Enable minification in build
- [ ] 9. Remove unused plugins from auth
- [ ] 10. Test Edge Runtime compatibility
- [ ] 11. Deploy and monitor Server-Timing headers
- [ ] 12. Add database indexes for slow queries

---

## Testing Performance

### Using Scalar API Reference

1. Open your API's Scalar docs
2. Check the Server-Timing header for breakdown
3. Look for the total response time

### Using cURL

```bash
# Test with timing
curl -w "\nTime Total: %{time_total}s\n" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  https://your-api.vercel.app/api/endpoint
```

### Using Vercel Analytics

Enable Vercel Speed Insights:

```bash
cd apps/api
bun add @vercel/analytics
```

---

## Troubleshooting

### Edge Runtime Errors

If you see "Module not found" errors with Edge Runtime:

1. Check all dependencies are Edge-compatible
2. Try reverting to Node.js runtime
3. Use `vercel dev` to test locally

### Database Connection Issues

If Neon HTTP driver has issues:

1. Verify `DATABASE_URL` is set correctly
2. Check Neon project settings allow HTTP access
3. Ensure `fetchConnectionCache` is enabled

### Auth Middleware Slow

If auth is still slow:

1. Add timing middleware to measure auth overhead
2. Consider caching user sessions in Redis
3. Use JWT tokens instead of database sessions

---

## Resources

- [Vercel Edge Functions](https://vercel.com/docs/functions/edge-functions)
- [Neon Serverless Driver](https://neon.tech/docs/serverless/serverless-driver)
- [Hono Performance Tips](https://hono.dev/docs/guides/best-practices)
- [Drizzle Performance](https://orm.drizzle.team/docs/performance)

---

**Last Updated**: February 24, 2026  
**Status**: Ready for implementation  
**Target**: <100ms average API response time
