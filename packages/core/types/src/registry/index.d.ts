import { OpenAPI } from "./types";
export declare function registerRoutes(app: OpenAPI): import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                data: {
                    id: number;
                    name: string;
                    done: boolean;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
                meta: {
                    currentPage: number;
                    limit: number;
                    totalCount: number;
                    totalPages: number;
                };
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                id: number;
                name: string;
                done: boolean;
                createdAt: string;
                updatedAt: string | null;
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                id: number;
                name: string;
                done: boolean;
                createdAt: string;
                updatedAt: string | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                id: number;
                name: string;
                done: boolean;
                createdAt: string;
                updatedAt: string | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {};
            outputFormat: string;
            status: 204;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
}, "/api/tasks"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
                auth: {
                    user: any;
                    session: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api">, "/api">;
export declare const router: import("@hono/zod-openapi").OpenAPIHono<import("@/types").APIBindings, import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                data: {
                    id: number;
                    name: string;
                    done: boolean;
                    createdAt: string;
                    updatedAt: string | null;
                }[];
                meta: {
                    currentPage: number;
                    limit: number;
                    totalCount: number;
                    totalPages: number;
                };
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                query: {
                    page?: string | undefined;
                    limit?: string | undefined;
                    sort?: "asc" | "desc" | undefined;
                    search?: string | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                id: number;
                name: string;
                done: boolean;
                createdAt: string;
                updatedAt: string | null;
            };
            outputFormat: "json";
            status: 201;
        } | {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                json: {
                    name: string;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        };
    };
} & {
    "/:id": {
        $get: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                id: number;
                name: string;
                done: boolean;
                createdAt: string;
                updatedAt: string | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/:id": {
        $patch: {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                id: number;
                name: string;
                done: boolean;
                createdAt: string;
                updatedAt: string | null;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                param: {
                    id: string;
                };
            } & {
                json: {
                    name?: string | undefined;
                    done?: boolean | undefined;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
} & {
    "/:id": {
        $delete: {
            input: {
                param: {
                    id: string;
                };
            };
            output: {};
            outputFormat: string;
            status: 204;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 500;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 401;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 422;
        } | {
            input: {
                param: {
                    id: string;
                };
            };
            output: {
                message: string;
            };
            outputFormat: "json";
            status: 404;
        };
    };
}, "/api/tasks"> & import("hono/types").MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                message: string;
                auth: {
                    user: any;
                    session: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/api">, "/api">;
export type Router = typeof router;
