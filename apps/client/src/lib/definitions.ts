import type {
  loanSchema,
  loginSchema,
  paymentSchema,
  signUpSchema,
} from "@sdfc-loans/types";
import type { z } from "zod";
import type { $ZodFlattenedError } from "zod/v4/core";

const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export const emptyLoginFormState: LoginFormState = {
  values: {
    email: "",
    password: "",
  },
  errors: {},
  success: true,
};

export const emptySignUpFormState: SignUpFormState = {
  values: {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  },
  errors: {},
  success: true,
};

export const emptyLoanFormState: LoanFormState = {
  values: {
    amount: 0,
    borrower: "",
    emi: 0,
    startDate: new Date().toLocaleDateString("en-CA", { timeZone: tz }),
    endDate: (() => {
      const d = new Date();
      d.setFullYear(d.getFullYear() + 1);
      return d.toLocaleDateString("en-CA", { timeZone: tz });
    })(),
    loanNumber: "",
  },
  errors: {},
  success: true,
};

export const emptyPaymentFormState: PaymentFormState = {
  values: {
    loanId: "",
    amount: 0,
  },
  errors: {},
  success: true,
};

export type LoginFormState = {
  values: LoginBody;
  errors: {
    server?: string;
    form?: $ZodFlattenedError<LoginBody>["fieldErrors"];
  };
  success: boolean;
};

export type SignUpFormState = {
  values: SignUpBody;
  errors: {
    server?: string;
    form?: $ZodFlattenedError<SignUpBody>["fieldErrors"];
  };
  success: boolean;
};

export type LoanFormState = {
  values: Omit<LoanItemBody, "startDate" | "endDate"> & {
    startDate: string;
    endDate: string;
  };
  errors: {
    server?: string;
    form?: $ZodFlattenedError<LoanItemBody>["fieldErrors"];
  };
  success: boolean;
};

export type PaymentFormState = {
  values: PaymentBody;
  errors: {
    server?: string;
    form?: $ZodFlattenedError<PaymentBody>["fieldErrors"];
  };
  success: boolean;
};

export type PaymentBody = z.infer<typeof paymentSchema>;
export type LoanItemBody = z.infer<typeof loanSchema>;
export type LoginBody = z.infer<typeof loginSchema>;
export type SignUpBody = z.infer<typeof signUpSchema>;
