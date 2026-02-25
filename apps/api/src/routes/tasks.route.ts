import { createRoute, z } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";

// Helpers Schemas
import {
  stringIdParamSchema,
  errorMessageSchema,
  queryParamsSchema,
  getPaginatedSchema
} from "core/zod";

// Entity Schemas
import { selectTaskSchema, insertTaskSchema, updateTaskSchema } from "core/zod";
import { authMiddleware } from "@/middlewares/auth.middleware";

const tags: string[] = ["Tasks"];

// List route definition
export const list = createRoute({
  tags,
  summary: "List all tasks",
  path: "/",
  method: "get",
  request: {
    query: queryParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      getPaginatedSchema(z.array(selectTaskSchema)),
      "The list of tasks"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error(s)"
    )
  }
});

// Create route definition
export const create = createRoute({
  tags,
  summary: "Create a new task",
  path: "/",
  method: "post",
  middleware: [authMiddleware],
  request: {
    body: jsonContentRequired(insertTaskSchema, "The task to create")
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectTaskSchema,
      "The created task"
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthroized request"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error(s)"
    )
  }
});

// Get single task route definition
export const getOne = createRoute({
  tags,
  summary: "Get a single task",
  method: "get",
  path: "/{id}",
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTaskSchema, "Requested task"),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Task not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid ID format"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error(s)"
    )
  }
});

// Patch route definition
export const patch = createRoute({
  tags,
  summary: "Update a task",
  path: "/{id}",
  method: "patch",
  middleware: [authMiddleware],
  request: {
    params: stringIdParamSchema,
    body: jsonContentRequired(updateTaskSchema, "The task updates")
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectTaskSchema, "The updated task"),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthroized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Task not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "The validation error(s)"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error(s)"
    )
  }
});

// Remove task route definition
export const remove = createRoute({
  tags,
  summary: "Remove a task",
  path: "/{id}",
  method: "delete",
  middleware: [authMiddleware],
  request: {
    params: stringIdParamSchema
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Task deleted"
    },
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      errorMessageSchema,
      "Unauthroized request"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      errorMessageSchema,
      "Task not found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      errorMessageSchema,
      "Invalid ID format"
    ),
    [HttpStatusCodes.INTERNAL_SERVER_ERROR]: jsonContent(
      errorMessageSchema,
      "Internal server error(s)"
    )
  }
});

export type ListRoute = typeof list;
export type CreateRoute = typeof create;
export type GetOneRoute = typeof getOne;
export type PatchRoute = typeof patch;
export type RemoveRoute = typeof remove;
