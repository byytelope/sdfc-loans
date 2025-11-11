import type { loanSchema, paymentSchema } from "@sdfc-loans/types";
import { z } from "zod";
import type { $ZodFlattenedError } from "zod/v4/core";

export const emptyLoginFormState: LoginFormState = {
  values: {
    email: "",
    password: "",
  },
  errors: null,
  success: true,
};

export const emptyLoanFormState: LoanFormState = {
  values: {
    amount: 0,
    borrower: "",
    emi: 0,
    startDate: new Date(),
    endDate: new Date(),
    loanNumber: "",
  },
  errors: null,
  success: true,
};

export const emptyPaymentFormState: PaymentFormState = {
  values: {
    loanId: "",
    amount: 0,
  },
  errors: null,
  success: true,
};

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type LoginFormState = {
  values: z.infer<typeof loginSchema>;
  errors: null | $ZodFlattenedError<z.infer<typeof loginSchema>>["fieldErrors"];
  success: boolean;
};

export type LoanFormState = {
  values: z.infer<typeof loanSchema>;
  errors: null | $ZodFlattenedError<z.infer<typeof loanSchema>>["fieldErrors"];
  success: boolean;
};

export type PaymentFormState = {
  values: z.infer<typeof paymentSchema>;
  errors:
    | null
    | $ZodFlattenedError<z.infer<typeof paymentSchema>>["fieldErrors"];
  success: boolean;
};

export type PaymentBody = z.infer<typeof paymentSchema>;
export type CreatePaymentRes =
  | { message: string }
  | { error: string }
  | { error: $ZodFlattenedError<PaymentBody>["fieldErrors"] };

export type LoanItemBody = z.infer<typeof loanSchema>;
export type CreateLoanRes =
  | { message: string }
  | { error: string }
  | { error: $ZodFlattenedError<LoanItemBody>["fieldErrors"] };
