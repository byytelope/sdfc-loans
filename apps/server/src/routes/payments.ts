import { paymentSchema } from "@sdfc-loans/types";
import { Hono } from "hono";
import { type JwtVariables, jwt } from "hono/jwt";
import { DatabaseError, Pool } from "pg";
import { z } from "zod";
import { mapPayments } from "../utils/mappers";

const pool = new Pool();
export const payments = new Hono<{
  Variables: JwtVariables<{ sub: string; email: string; isAdmin: boolean }>;
}>();

payments.use(jwt({ secret: process.env.JWT_SECRET ?? "" }));

payments.get("/", async (c) => {
  const { sub: userId, isAdmin } = c.get("jwtPayload");

  try {
    if (isAdmin) {
      const res = await pool.query(
        "SELECT p.id AS id, l.id AS loan_id, l.loan_number AS loan_number, r.id AS recorder_id, r.name AS recorder_name, r.email AS recorder_email, b.id AS borrower_id, b.name AS borrower_name, b.email AS borrower_email, p.payment_date, p.amount, p.created_at FROM payments p JOIN loans l ON p.loan_id = l.id JOIN users b ON l.user_id = b.id LEFT JOIN users r ON p.created_by = r.id",
      );
      return c.json({ data: res.rows.map(mapPayments) });
    } else {
      const res = await pool.query(
        "SELECT p.id AS id, l.id AS loan_id, l.loan_number AS loan_number, r.id AS recorder_id, r.name AS recorder_name, r.email AS recorder_email, b.id AS borrower_id, b.name AS borrower_name, b.email AS borrower_email, p.payment_date, p.amount, p.created_at FROM payments p JOIN loans l ON p.loan_id = l.id JOIN users b ON l.user_id = b.id LEFT JOIN users r ON p.created_by = r.id WHERE b.id = $1",
        [userId],
      );
      return c.json({ data: res.rows.map(mapPayments) });
    }
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch payments" }, 500);
  }
});

payments.post("/", async (c) => {
  const { sub: userId, isAdmin } = c.get("jwtPayload");

  try {
    const body = await c.req.json();
    const parsed = paymentSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
    }

    const { amount, loanId } = parsed.data;

    const res = await pool.query(`SELECT user_id FROM loans WHERE id = $1`, [
      loanId,
    ]);

    if (!res.rows[0]) return c.json({ error: "Loan not found" }, 404);

    const borrowerId = res.rows[0]?.user_id;

    if (borrowerId === userId || isAdmin) {
      await pool.query(
        `INSERT INTO payments (loan_id, created_by, payment_date, amount)
       VALUES ($1, $2, $3, $4)`,
        [loanId, userId, new Date(), amount],
      );
      return c.json({ message: "Payment recorded successfully" }, 201);
    } else {
      return c.json({ error: "Forbidden" }, 403);
    }
  } catch (err) {
    if (err instanceof DatabaseError) {
      return c.json({ error: err.detail ?? err.message }, 400);
    }

    console.error(err);
    return c.json({ error: "Failed to create payment" }, 500);
  }
});

payments.delete("/:id", async (c) => {
  const { isAdmin } = c.get("jwtPayload");
  if (!isAdmin) return c.json({ error: "Forbidden" }, 403);

  const id = c.req.param("id");

  try {
    const res = await pool.query(
      "DELETE FROM payments WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) return c.json({ error: "Payment not found" }, 404);

    return c.json({ message: "Payment deleted" });
  } catch (err) {
    if (err instanceof DatabaseError) {
      return c.json({ error: err.detail ?? err.message }, 400);
    }

    console.error(err);
    return c.json({ error: "Failed to delete payment" }, 500);
  }
});
