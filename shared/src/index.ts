import { z } from "zod";

export type Loan = {
  id: string;
  loan_number: string;
  amount: number;
  start_date: Date;
  end_date: Date;
  emi: number;
  outstanding: number;
  overdue: number;
};

export const loanSchema = z
  .object({
    loan_number: z.string().min(1),
    amount: z.number().positive(),
    start_date: z.date(),
    end_date: z.date(),
    emi: z.number().nonnegative(),
    outstanding: z.number().nonnegative(),
    overdue: z.number().nonnegative(),
  })
  .refine((data) => data.start_date < data.end_date, {
    message: "start_date must be before end_date",
    path: ["start_date"],
  })
  .refine((data) => data.end_date > data.start_date, {
    message: "end_date must be after start_date",
    path: ["end_date"],
  });
