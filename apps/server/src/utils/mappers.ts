/** biome-ignore-all lint/suspicious/noExplicitAny: nah */
import type { Loan, LoanDetails, User } from "@sdfc-loans/types";

export function mapLoanRow(row: any): Loan {
  return {
    id: row.id,
    loanNumber: row.loan_number,
    userId: row.user_id,
    amount: parseFloat(row.amount),
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    emi: parseFloat(row.emi),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

export function mapLoanDetails(row: any): LoanDetails {
  return {
    id: row.id,
    loanNumber: row.loan_number,
    userId: row.user_id,
    userName: row.user_name,
    userEmail: row.user_email,
    amount: parseFloat(row.amount),
    startDate: new Date(row.start_date),
    endDate: new Date(row.end_date),
    emi: parseFloat(row.emi),
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    totalPaid: parseFloat(row.total_paid),
    outstanding: parseFloat(row.outstanding),
    overdue: parseFloat(row.overdue),
  };
}

export function mapUsers(row: any): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    isAdmin: row.is_admin,
  };
}
