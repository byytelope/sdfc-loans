import { loanSchema, paymentSchema } from "@sdfc-loans/types";
import { Hono } from "hono";
import { type JwtVariables, jwt } from "hono/jwt";
import { Pool } from "pg";
import { z } from "zod";

import { mapLoanDetails } from "../utils/mappers";

const pool = new Pool();
export const loans = new Hono<{
  Variables: JwtVariables<{ sub: string; email: string; isAdmin: boolean }>;
}>();

loans.use(jwt({ secret: process.env.JWT_SECRET ?? "" }));

loans.get("/", async (c) => {
  const { sub: userId, isAdmin } = c.get("jwtPayload");

  try {
    if (isAdmin) {
      const res = await pool.query("SELECT * FROM loan_details");
      return c.json({ data: res.rows.map(mapLoanDetails) });
    } else {
      const res = await pool.query(
        "SELECT * FROM loan_details WHERE user_id = $1",
        [userId],
      );
      return c.json({ data: res.rows.map(mapLoanDetails) });
    }
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch loans" }, 500);
  }
});

loans.get("/:id", async (c) => {
  const id = c.req.param("id");
  const { sub: userId, isAdmin } = c.get("jwtPayload");

  try {
    const res = await pool.query("SELECT * FROM loan_details WHERE id = $1", [
      id,
    ]);
    if (res.rowCount === 0) return c.json({ error: "Loan not found" }, 404);

    const loanDetails = mapLoanDetails(res.rows[0]);

    if (isAdmin || loanDetails.userId === userId) {
      return c.json({ data: loanDetails });
    } else {
      return c.json({ error: "Forbidden" }, 403);
    }
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch loan" }, 500);
  }
});

loans.post("/", async (c) => {
  const { isAdmin } = c.get("jwtPayload");
  if (!isAdmin) return c.json({ error: "Forbidden" }, 403);

  try {
    const body = await c.req.json();
    const parsed = loanSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: z.flattenError(parsed.error).fieldErrors }, 400);
    }

    const { loanNumber, borrower, amount, startDate, endDate, emi } =
      parsed.data;

    await pool.query(
      `INSERT INTO loans (loan_number, user_id, amount, start_date, end_date, emi)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [loanNumber, borrower, amount, startDate, endDate, emi],
    );

    return c.json({ message: "Loan created successfully" }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to create loan" }, 500);
  }
});

loans.post("/payment", async (c) => {
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
    console.error(err);
    return c.json({ error: "Failed to create loan" }, 500);
  }
});

loans.delete("/:id", async (c) => {
  const { isAdmin } = c.get("jwtPayload");
  if (!isAdmin) return c.json({ error: "Forbidden" }, 403);

  const id = c.req.param("id");

  try {
    const res = await pool.query(
      "DELETE FROM loans WHERE id = $1 RETURNING *",
      [id],
    );
    if (res.rowCount === 0) return c.json({ error: "Loan not found" }, 404);

    return c.json({ message: "Loan deleted" });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to delete loan" }, 500);
  }
});
