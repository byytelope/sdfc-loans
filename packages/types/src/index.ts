import { z } from "zod";

export type User = {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
  createdAt: Date;
};

export type Loan = {
  id: string;
  loanNumber: string;
  userId: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  emi: number;
  createdAt: Date;
  updatedAt: Date;
};

export type LoanDetails = {
  id: string;
  loanNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  startDate: Date;
  endDate: Date;
  emi: number;
  createdAt: Date;
  updatedAt: Date;
  totalPaid: number;
  outstanding: number;
  overdue: number;
};

export type Payment = {
  id: string;
  loanId: string;
  createdBy: string;
  paymentDate: Date;
  amount: number;
  createdAt: Date;
};

export const loanSchema = z
  .object({
    loanNumber: z.string().min(1),
    amount: z.number().positive(),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    emi: z.number().nonnegative(),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: "start_date must be before end_date",
    path: ["start_date"],
  });

export const paymentSchema = z.object({
  loanId: z.uuid(),
  amount: z.number().positive(),
});
