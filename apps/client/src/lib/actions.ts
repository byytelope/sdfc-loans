"use server";

import {
  type LoanDetails,
  loanSchema,
  paymentSchema,
  type User,
} from "@sdfc-loans/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  type CreateLoanRes,
  type CreatePaymentRes,
  emptyLoanFormState,
  emptyPaymentFormState,
  type LoanFormState,
  type LoanItemBody,
  type LoginFormState,
  loginSchema,
  type PaymentBody,
  type PaymentFormState,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";

export const getAllUsers = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.API_URL ?? ""}/v1/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errBody = await res.json();
    const message = errBody.error ?? `Failed to fetch users (${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data as User[];
};

export const getLoanItems = async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errBody = await res.json();
    const message = errBody.error ?? `Failed to fetch loans (${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data as LoanDetails[];
};

export const getLoanItem = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errBody = await res.json();
    const message = errBody.error ?? `Failed to fetch loans (${res.status})`;
    throw new Error(message);
  }

  const json = await res.json();
  return json.data as LoanDetails;
};

export const deleteLoanItem = async (id: string) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const deleteRes: { message: string } | { error: string } = await res.json();
  return deleteRes;
};

export const createLoanAction = async (
  _prevState: LoanFormState,
  formData: FormData,
): Promise<LoanFormState> => {
  const values = {
    loanNumber: formData.get("loanNumber") as string,
    borrower: formData.get("borrower") as string,
    amount: parseFloat(formData.get("amount") as string),
    startDate: new Date(formData.get("startDate") as string),
    endDate: new Date(formData.get("endDate") as string),
    emi: parseFloat(formData.get("emi") as string),
  };

  const res = loanSchema.safeParse(values);

  if (!res.success)
    return {
      values,
      success: false,
      errors: z.flattenError(res.error).fieldErrors,
    };

  console.log(res.data);
  const apiRes = await createLoanItem(res.data);

  if ("error" in apiRes) {
    console.error(apiRes.error);
    return {
      values,
      success: false,
      errors: {},
    };
  }

  return emptyLoanFormState;
};

export const createLoanItem = async (loanItem: LoanItemBody) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans`, {
    method: "POST",
    body: JSON.stringify(loanItem),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const createRes: CreateLoanRes = await res.json();
  return createRes;
};

export const recordPaymentAction = async (
  _prevState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> => {
  const values = {
    loanId: formData.get("loanId") as string,
    amount: formData.get("amount") as unknown as number,
  };

  const res = paymentSchema.safeParse(values);

  if (!res.success)
    return {
      values,
      success: false,
      errors: z.flattenError(res.error).fieldErrors,
    };

  const apiRes = await recordPayment(res.data);

  if ("error" in apiRes) {
    console.error(apiRes.error);
    return {
      values,
      success: false,
      errors: {},
    };
  }

  return emptyPaymentFormState;
};

export const recordPayment = async (payment: PaymentBody) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans/payment`, {
    method: "POST",
    body: JSON.stringify(payment),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const createRes: CreatePaymentRes = await res.json();
  return createRes;
};

export const loginAction = async (
  _prevState: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> => {
  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const res = loginSchema.safeParse(values);

  if (!res.success)
    return {
      values,
      success: false,
      errors: z.flattenError(res.error).fieldErrors,
    };

  const apiRes = await fetch(`${process.env.API_URL ?? ""}/v1/login`, {
    method: "POST",
    body: JSON.stringify(res.data),
  });
  const body:
    | {
        error: string;
      }
    | {
        user: {
          id: string;
          name: string;
          email: string;
          isAdmin: boolean;
        };
        token: string;
      } = await apiRes.json();

  if ("error" in body) {
    return {
      values,
      success: false,
      errors: { email: [body.error], password: [body.error] },
    };
  }

  await createSession(body.token, body.user);
  redirect("/");
};

export const logout = async () => {
  await deleteSession();
  redirect("/login");
};
