import { loanSchema } from "@sdfc-loans/shared";
import { Hono } from "hono";
import { Pool } from "pg";

const pool = new Pool();
const loans = new Hono();

loans.get("/", async (c) => {
  try {
    const res = await pool.query(
      "SELECT * FROM loans ORDER BY start_date DESC",
    );
    return c.json({ data: res.rows });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch loans" }, 500);
  }
});

loans.get("/:id", async (c) => {
  const id = c.req.param("id");

  try {
    const res = await pool.query("SELECT * FROM loans WHERE id = $1", [id]);
    if (res.rowCount === 0) return c.json({ error: "Loan not found" }, 404);

    return c.json({ data: res.rows[0] });
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to fetch loan" }, 500);
  }
});

loans.post("/", async (c) => {
  try {
    const body = await c.req.json();
    const parsed = loanSchema.safeParse(body);

    if (!parsed.success) {
      return c.json({ error: parsed.error }, 400);
    }

    const {
      loan_number,
      amount,
      start_date,
      end_date,
      emi,
      outstanding,
      overdue,
    } = parsed.data;

    await pool.query(
      `INSERT INTO loans (loan_number, amount, start_date, end_date, emi, outstanding, overdue)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [loan_number, amount, start_date, end_date, emi, outstanding, overdue],
    );

    return c.json({ message: "Loan created successfully" }, 201);
  } catch (err) {
    console.error(err);
    return c.json({ error: "Failed to create loan" }, 500);
  }
});

loans.delete("/:id", async (c) => {
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

export { loans };
