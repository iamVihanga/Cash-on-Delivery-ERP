import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskByID,
  updateTask
} from "core/database/queries";

import { APIRouteHandler } from "@/types";
import type {
  ListRoute,
  CreateRoute,
  GetOneRoute,
  PatchRoute,
  RemoveRoute
} from "@/routes/tasks.route";

// Get all tasks as paginated response handler
// @ts-ignore
export const list: APIRouteHandler<ListRoute> = async (c) => {
const db = c.get("db");
  try {
    const db = c.get("db");
    const queryParams = c.req.valid("query");

    const queryResponse = await getAllTasks(db, queryParams);

    if (queryResponse instanceof Error) {
      throw queryResponse;
    }

    return c.json(queryResponse, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Create new task handler
// @ts-ignore
export const create: APIRouteHandler<CreateRoute> = async (c) => {
const db = c.get("db");
  try {
    const db = c.get("db");
    const session = c.get("session");
    const body = c.req.valid("json");

    if (!session) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    const queryResponse = await createTask(db, body);

    if (queryResponse instanceof Error) {
      throw queryResponse;
    }

    return c.json(queryResponse, HttpStatusCodes.CREATED);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Get single task by ID handler
export const getOne: APIRouteHandler<GetOneRoute> = async (c) => {
  try {
    const db = c.get("db");
    const { id } = c.req.valid("param");

    const queryResponse = await getTaskByID(db, parseInt(id));

    if (queryResponse instanceof Error) {
      throw queryResponse;
    }

    if (!queryResponse) {
      return c.json({ message: "Task not found !" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(queryResponse, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Update task handler
export const patch: APIRouteHandler<PatchRoute> = async (c) => {
  try {
    const db = c.get("db");
    const session = c.get("session");

    if (!session) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    const body = c.req.valid("json");
    const { id } = c.req.valid("param");

    const queryResponse = await updateTask(db, parseInt(id), body);

    if (queryResponse instanceof Error) {
      throw queryResponse;
    }

    if (!queryResponse) {
      return c.json({ message: "Task not found !" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(queryResponse, HttpStatusCodes.OK);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};

// Delete task handler
export const remove: APIRouteHandler<RemoveRoute> = async (c) => {

const db = c.get("db");
  try {
    const db = c.get("db");
    const session = c.get("session");

    if (!session) {
      return c.json(
        { message: HttpStatusPhrases.UNAUTHORIZED },
        HttpStatusCodes.UNAUTHORIZED
      );
    }

    const { id } = c.req.valid("param");

    const queryResponse = deleteTask(db, parseInt(id));

    if (queryResponse instanceof Error) {
      throw queryResponse;
    }

    if (!queryResponse) {
      return c.json({ message: "Task not found !" }, HttpStatusCodes.NOT_FOUND);
    }

    return c.json(HttpStatusCodes.NO_CONTENT);
  } catch (error) {
    return c.json(
      {
        message:
          (error as Error).message || HttpStatusPhrases.INTERNAL_SERVER_ERROR
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR
    );
  }
};
