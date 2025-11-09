import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";

import { loans } from "./routes/loans";

const app = new Hono({ strict: false });
const v1 = new Hono();

v1.route("/loans", loans);

app.use(logger());
app.use(cors());

app.get("/", (c) => c.text("API running"));
app.route("/api/v1", v1);

export default {
  port: 3500,
  fetch: app.fetch,
};
