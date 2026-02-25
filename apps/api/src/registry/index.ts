import { createAPIRouter } from "@/lib/setup-api";
import { OpenAPI } from "@/types";

import { BASE_PATH } from "@/lib/constants";

import index from "../routes/index.route";
import tasks from "./tasks.registry";
import books from "./books.registry";
import subjects from "./subjects.registry";
import lessons from "./lessons.registry";
import answer from "./answer.registry";
import grade from "./grade.registry";
import media from "./media.registry";
import quiz from "./quiz.registry";
import paymentPlans from "./paymentPlans.registry";
import section from "./section.registry";
import studentPayments from "./studentPayments.registry";
import system from "./system.registry";
import user from "./user.registry";
import videoLesson from "./videoLesson.registry";

export function registerRoutes(app: OpenAPI) {
  const registeredApp = app
  .route("/", index)
  .route("/tasks", tasks)
  .route("/books", books)
  .route("/subjects", subjects)
  .route("/lessons", lessons)
  .route("/answer", answer)
  .route("/grade", grade)
  .route("/media", media)
   .route("/quizzes", quiz)
  .route("/paymentPlans", paymentPlans)
  .route("/section", section)
  .route("/studentPayments", studentPayments)
  .route("/system", system)
    .route("/user", user)
   .route("/videoLesson", videoLesson)


  return registeredApp;
}

// Standalone router instance and type export for RPC
export const router = registerRoutes(createAPIRouter().basePath(BASE_PATH));

export type Router = typeof router;
