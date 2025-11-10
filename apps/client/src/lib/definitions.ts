import type { loanSchema, paymentSchema } from "@sdfc-loans/types";
import { z } from "zod";
import type { $ZodFlattenedError } from "zod/v4/core";

export const emptyFormState: FormState = {
  values: {
    email: "",
    password: "",
  },
  errors: null,
  success: true,
};

export const loginSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type FormState = {
  values: z.infer<typeof loginSchema>;
  errors: null | $ZodFlattenedError<z.infer<typeof loginSchema>>["fieldErrors"];
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
