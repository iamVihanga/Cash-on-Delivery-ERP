import { MiddlewareHandler } from "hono";

import { getAuth } from "core/auth/setup";

import { APIBindings } from "@/types";

export const authMiddleware: MiddlewareHandler<APIBindings> = async (
  c,
  next
) => {
  const auth = getAuth();
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    c.set("session", null);
    c.set("user", null);
    return next();
  }

  c.set("session", session.session);
  c.set("user", session.user);
  return next();
};
