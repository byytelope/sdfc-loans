import { z } from "zod";

export type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
};

export type DBUser = {
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

export type PaymentDetails = {
  id: string;
  loanId: string;
  loanNumber: string;
  recorderId: string;
  recorderName: string;
  recorderEmail: string;
  borrowerId: string;
  borrowerName: string;
  borrowerEmail: string;
  paymentDate: Date;
  amount: number;
  createdAt: Date;
};

export type Payment = {
  id: string;
  loanId: string;
  createdBy: string;
  paymentDate: Date;
  amount: number;
  createdAt: Date;
};

export const loginSchema = z.object({
  email: z.email("Enter a valid email"),
  password: z.string("Enter a valid password"),
});

export const signUpSchema = z
  .object({
    name: z.string().min(2, "Must be 2 or more characters"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be 8 or more characters"),
    confirmPassword: z.string().min(8, "Password must be 8 or more characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export const loanSchema = z
  .object({
    loanNumber: z.string().min(1, "Enter a valid loan number"),
    borrower: z.uuid("Select a valid borrower"),
    amount: z.number().positive("Must be greater than 1"),
    startDate: z.coerce.date(),
    endDate: z.coerce.date(),
    emi: z.number().nonnegative("Must be greater than 1"),
  })
  .refine((data) => data.startDate < data.endDate, {
    message: '"Start Date" must be before "End Date"',
    path: ["startDate"],
  });

export const paymentSchema = z.object({
  loanId: z.uuid("Select a valid loan"),
  amount: z.number().positive("Must be greater than 1"),
});
