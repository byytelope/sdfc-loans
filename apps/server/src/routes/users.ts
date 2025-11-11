import { Hono } from "hono";
import { type JwtVariables, jwt } from "hono/jwt";
import { Pool } from "pg";
import { mapUsers } from "../utils/mappers";

const pool = new Pool();
export const users = new Hono<{
  Variables: JwtVariables<{ sub: string; email: string; isAdmin: boolean }>;
}>();

users.use(jwt({ secret: process.env.JWT_SECRET ?? "" }));

users.get("/", async (c) => {
  const { isAdmin } = c.get("jwtPayload");
  if (!isAdmin) return c.json({ error: "Forbidden" }, 403);

  const res = await pool.query("SELECT * FROM users WHERE is_admin = false");
  return c.json({ data: res.rows.map(mapUsers) });
});
