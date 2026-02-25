import { handle } from "hono/vercel";
import app from "./src/app";

// Switch from Node.js serverless to Edge runtime
export const runtime = "edge";

export default handle(app);
