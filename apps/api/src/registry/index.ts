import { createAPIRouter } from "@/lib/setup-api";
import { OpenAPI } from "@/types";

import { BASE_PATH } from "@/lib/constants";

import index from "../routes/index.route";
import tasks from "./tasks.registry";

export function registerRoutes(app: OpenAPI) {
  const registeredApp = app.route("/", index).route("/tasks", tasks);

  return registeredApp;
}

// Standalone router instance and type export for RPC
export const router = registerRoutes(createAPIRouter().basePath(BASE_PATH));

export type Router = typeof router;
