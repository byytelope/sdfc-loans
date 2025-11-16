import { type DBUser, loginSchema, signUpSchema } from "@sdfc-loans/types";
import { Hono } from "hono";
import { Pool } from "pg";
import { z } from "zod";

import { checkPassword, createToken, hashPassword } from "../utils/auth";

const pool = new Pool();
export const auth = new Hono();

auth.post("/login", async (c) => {
  try {
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

    const user = res.rows[0] as DBUser;
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
  } catch (e) {
    console.error(e);
    return c.json({ error: "Server error" }, 500);
  }
});

auth.post("/signup", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) return c.json(z.treeifyError(parsed.error), 400);

    const { name, email, password } = parsed.data;

    const exists = await pool.query(`SELECT 1 FROM users WHERE email = $1`, [
      email,
    ]);

    if (exists.rows.length > 0) {
      return c.json({ error: "Email already registered" }, 409);
    }

    const passwordHash = await hashPassword(password);

    const res = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email, password_hash AS "passwordHash", is_admin AS "isAdmin"',
      [name, email, passwordHash],
    );

    const user = res.rows[0] as DBUser;

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
  } catch (e) {
    console.error(e);
    return c.json({ error: "Server error" }, 500);
  }
});
