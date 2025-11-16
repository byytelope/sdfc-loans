"use server";

import {
  type LoanDetails,
  loanSchema,
  loginSchema,
  type PaymentDetails,
  paymentSchema,
  signUpSchema,
  type User,
} from "@sdfc-loans/types";
import { refresh } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import {
  emptyLoanFormState,
  emptyPaymentFormState,
  type LoanFormState,
  type LoanItemBody,
  type LoginFormState,
  type PaymentBody,
  type PaymentFormState,
  type Result,
  type SignUpFormState,
} from "@/lib/definitions";
import { createSession, deleteSession } from "@/lib/session";

export const getUsers = async (): Promise<Result<User[]>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
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
    return { success: true, data: (json.data as User[]) ?? [] };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const getLoans = async (): Promise<Result<LoanDetails[]>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message = errBody.error ?? `Failed to fetch loans (${res.status})`;
      return { success: false, error: message };
    }

    const json = await res.json();
    return { success: true, data: (json.data as LoanDetails[]) ?? [] };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const getLoan = async (id: string): Promise<Result<LoanDetails>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message =
        errBody.error ?? `Failed to fetch loan item (${res.status})`;
      return { success: false, error: message };
    }

    const json = await res.json();
    return { success: true, data: json.data as LoanDetails };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const deleteLoan = async (
  id: string,
): Promise<Result<{ message: string }>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message =
        errBody.error ?? `Failed to delete loan item (${res.status})`;
      return { success: false, error: message };
    }

    const deleteRes: { message: string } = await res.json();
    refresh();
    return { success: true, data: deleteRes };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const createLoanFormAction = async (
  _prevState: LoanFormState,
  formData: FormData,
): Promise<LoanFormState> => {
  const values = {
    loanNumber: formData.get("loanNumber") as string,
    borrower: formData.get("borrower") as string,
    amount: parseFloat(formData.get("amount") as string),
    startDate: formData.get("startDate") as string,
    endDate: formData.get("endDate") as string,
    emi: parseFloat(formData.get("emi") as string),
  };

  const res = loanSchema.safeParse(values);

  if (!res.success) {
    console.error(res.error);
    return {
      values,
      success: false,
      errors: { form: z.flattenError(res.error).fieldErrors },
    };
  }

  const apiRes = await createLoan(res.data);

  if (!apiRes.success) {
    console.error(apiRes.error);
    return {
      values,
      success: false,
      errors: { server: apiRes.error },
    };
  }

  return emptyLoanFormState;
};

export const createLoan = async (
  loanItem: LoanItemBody,
): Promise<Result<{ message: string }>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/loans`, {
      method: "POST",
      body: JSON.stringify(loanItem),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message =
        errBody.error ?? `Failed to create loan item (${res.status})`;
      return { success: false, error: message };
    }

    const createRes = await res.json();
    refresh();
    return { success: true, data: createRes };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const getPayments = async (): Promise<Result<PaymentDetails[]>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/payments`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message =
        errBody.error ?? `Failed to fetch payments (${res.status})`;
      return { success: false, error: message };
    }

    const json = await res.json();
    return { success: true, data: (json.data as PaymentDetails[]) ?? [] };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const deletePayment = async (
  id: string,
): Promise<Result<{ message: string }>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/payments/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message =
        errBody.error ?? `Failed to delete payment (${res.status})`;
      return { success: false, error: message };
    }

    const deleteRes: { message: string } = await res.json();
    refresh();
    return { success: true, data: deleteRes };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const createPaymentFormAction = async (
  _prevState: PaymentFormState,
  formData: FormData,
): Promise<PaymentFormState> => {
  const values = {
    loanId: formData.get("loanId") as string,
    amount: parseFloat(formData.get("amount") as string),
  };

  const res = paymentSchema.safeParse(values);

  if (!res.success)
    return {
      values,
      success: false,
      errors: { form: z.flattenError(res.error).fieldErrors },
    };

  const apiRes = await createPayment(res.data);

  if (!apiRes.success) {
    console.error(apiRes.error);
    return {
      values,
      success: false,
      errors: { server: apiRes.error },
    };
  }

  return emptyPaymentFormState;
};

export const createPayment = async (
  payment: PaymentBody,
): Promise<Result<{ message: string }>> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  try {
    const res = await fetch(`${process.env.API_URL ?? ""}/v1/payments`, {
      method: "POST",
      body: JSON.stringify(payment),
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      const errBody = await res.json();
      const message =
        errBody.error ?? `Failed to create payment (${res.status})`;
      return { success: false, error: message };
    }

    const createRes = await res.json();
    refresh();
    return { success: true, data: createRes };
  } catch (e) {
    console.error(e);
    return { success: false, error: "Server error" };
  }
};

export const loginFormAction = async (
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
      errors: { form: z.flattenError(res.error).fieldErrors },
    };

  try {
    const apiRes = await fetch(`${process.env.API_URL ?? ""}/v1/login`, {
      method: "POST",
      body: JSON.stringify(res.data),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.json();
      const message = errBody.error ?? `Failed to log in (${apiRes.status})`;

      return {
        values,
        success: false,
        errors: { server: message },
      };
    }

    const body: {
      user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
      };
      token: string;
    } = await apiRes.json();

    await createSession(body.token, body.user);
  } catch (e) {
    console.error(e);

    return {
      values,
      success: false,
      errors: { server: "Server error" },
    };
  }

  redirect("/");
};

export const signUpFormAction = async (
  _prevState: SignUpFormState,
  formData: FormData,
): Promise<SignUpFormState> => {
  const values = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  const res = signUpSchema.safeParse(values);

  if (!res.success)
    return {
      values,
      success: false,
      errors: { form: z.flattenError(res.error).fieldErrors },
    };

  try {
    const apiRes = await fetch(`${process.env.API_URL ?? ""}/v1/signup`, {
      method: "POST",
      body: JSON.stringify(res.data),
    });

    if (!apiRes.ok) {
      const errBody = await apiRes.json();
      const message = errBody.error ?? `Failed to sign up (${apiRes.status})`;

      return {
        values,
        success: false,
        errors: { server: message },
      };
    }

    const body: {
      user: {
        id: string;
        name: string;
        email: string;
        isAdmin: boolean;
      };
      token: string;
    } = await apiRes.json();

    await createSession(body.token, body.user);
  } catch (e) {
    console.error(e);

    return {
      values,
      success: false,
      errors: { server: "Server error" },
    };
  }

  redirect("/");
};

export const logout = async () => {
  await deleteSession();
  redirect("/login");
};
