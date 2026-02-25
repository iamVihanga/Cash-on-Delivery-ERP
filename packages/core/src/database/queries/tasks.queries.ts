import { and, desc, eq, ilike, sql } from "drizzle-orm";

import { tasks } from "../schema";
import { prepareQueryParams, type QueryParamsSchema } from "../../zod/helpers";
import type {
  GetAllTasksResponseT,
  InsertTaskT,
  SelectTaskT,
  UpdateTaskT
} from "../../zod/tasks.schemas";
import type { Database } from "..";

/**
 * Get all Tasks with pagination query
 * @param params Query parameters for pagination
 * @returns Paginated list of tasks or an Error
 */
export async function getAllTasks(
  db: Database,
  params: QueryParamsSchema
): Promise<GetAllTasksResponseT | Error> {
  const { limit, offset, search, sort, page } = prepareQueryParams(params);

  const getAllQuery = await db.query.tasks.findMany({
    limit,
    offset,
    where: (fields, { ilike, and }) => {
      const conditions = [];

      // Add search condition if search param is provided
      if (search) {
        conditions.push(ilike(fields.name, `%${search}%`));
      }

      return conditions.length > 0 ? and(...conditions) : undefined;
    },
    orderBy: (fields) => {
      if (sort === "asc") {
        return fields.createdAt;
      }

      return desc(fields.createdAt);
    }
  });

  // Get total count for pagination metadata
  const totalCountQuery = db
    .select({ count: sql<number>`count(*)` })
    .from(tasks)
    .where(search ? and(ilike(tasks.name, `%${search}%`)) : undefined);

  const [allEntries, totalCount] = await Promise.all([
    getAllQuery,
    totalCountQuery
  ]);

  const totalEntries = totalCount[0]?.count || 0;

  // Calculate pagination metadata
  const totalPages = Math.ceil(totalEntries / limit);

  return {
    data: allEntries,
    meta: {
      currentPage: page,
      limit,
      totalCount: totalEntries,
      totalPages
    }
  } as GetAllTasksResponseT;
}

/**
 * Get one task by ID query
 * @param id Task ID
 * @returns Task object or null if not found
 */
export async function getTaskByID(
  db: Database,
  id: number
): Promise<SelectTaskT | null | Error> {
  const task = await db.query.tasks.findFirst({
    where: (fields) => eq(fields.id, id)
  });

  if (!task) return null;

  return task as SelectTaskT;
}

/**
 * Create task query
 * @param body Task data
 * @returns Created task object or an Error
 */
export async function createTask(
  db: Database,
  body: InsertTaskT
): Promise<SelectTaskT | Error> {
  const createdTask = await db.insert(tasks).values(body).returning();

  if (createdTask.length === 0) {
    return new Error("Failed to create task");
  }

  return createdTask[0] as SelectTaskT;
}

/**
 * Update task query
 * @param id Task ID
 * @param body Task data to update
 * @returns Updated task object or null if not found or an Error
 */
export async function updateTask(
  db: Database,
  id: number,
  body: UpdateTaskT
): Promise<SelectTaskT | null | Error> {
  const updatedTask = await db
    .update(tasks)
    .set(body)
    .where(eq(tasks.id, id))
    .returning();

  if (updatedTask.length === 0)
    throw new Error("Failed to update task or task not found");

  return updatedTask[0] as SelectTaskT;
}

/**
 * Delete task query
 * @param id Task ID
 * @returns true if deleted, false if not found, or an Error
 */
export async function deleteTask(
  db: Database,
  id: number
): Promise<boolean | Error> {
  const deletedTask = await db
    .delete(tasks)
    .where(eq(tasks.id, id))
    .returning();

  if (deletedTask.length === 0) return false;

  return true;
}
