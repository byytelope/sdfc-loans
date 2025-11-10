import type { User } from "@sdfc-loans/types";
import { Hono } from "hono";
import { Pool } from "pg";
import { z } from "zod";

import { checkPassword, createToken } from "../utils/auth";

const pool = new Pool();
export const auth = new Hono();

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

auth.post("/login", async (c) => {
  const body = await c.req.json();
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) return c.json(z.treeifyError(parsed.error), 400);

  const { email, password } = parsed.data;
  const res = await pool.query(
    'SELECT id, name, email, password_hash AS "passwordHash", is_admin AS "isAdmin" FROM users WHERE email = $1',
    [email],
  );

  if (res.rows.length === 0)
    return c.json({ error: "Invalid credentials" }, 401);

  const user = res.rows[0] as User;
  const valid = await checkPassword(password, user.passwordHash);
  if (!valid) return c.json({ error: "Invalid credentials" }, 401);

  const token = await createToken({
    sub: user.id,
    email: user.email,
    isAdmin: user.isAdmin,
  });

  return c.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    token,
  });
});
