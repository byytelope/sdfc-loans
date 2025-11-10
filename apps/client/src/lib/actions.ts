"use server";

import type { LoanDetails } from "@sdfc-loans/types";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  type CreateLoanRes,
  type CreatePaymentRes,
  type FormState,
  type LoanItemBody,
  loginSchema,
  type PaymentBody,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";

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

export const login = async (
  _prevState: FormState,
  formData: FormData,
): Promise<FormState> => {
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

  await createSession(body.token);
  redirect("/");
};

export const logout = async () => {
  await deleteSession();
  redirect("/login");
};
