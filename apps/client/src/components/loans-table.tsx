"use client";

import type { LoanDetails } from "@sdfc-loans/types";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/utils";
import { CreateLoanDialog } from "./create-loan-dialog";

export const LoansTable = ({
  isAdmin,
  loanItems,
}: {
  isAdmin: boolean;
  loanItems: LoanDetails[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 w-full justify-end">
        {isAdmin && <CreateLoanDialog />}
        <Button>Record Payment</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan #</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>EMI</TableHead>
            <TableHead>Start</TableHead>
            <TableHead>End</TableHead>
            <TableHead className="text-right">Total Paid</TableHead>
            <TableHead className="text-right">Outstanding</TableHead>
            <TableHead className="text-right">Overdue</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loanItems.map((loan) => (
            <TableRow key={loan.id}>
              <TableCell>{loan.loanNumber}</TableCell>
              <TableCell>{loan.userName}</TableCell>
              <TableCell>{loan.userEmail}</TableCell>
              <TableCell className="text-right">
                {currency.format(loan.amount)}
              </TableCell>
              <TableCell>{currency.format(loan.emi)}</TableCell>
              <TableCell>
                {new Date(loan.startDate).toLocaleDateString()}
              </TableCell>
              <TableCell>
                {new Date(loan.endDate).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                {currency.format(loan.totalPaid)}
              </TableCell>
              <TableCell className="text-right">
                {currency.format(loan.outstanding)}
              </TableCell>
              <TableCell className="text-right">
                {currency.format(loan.overdue)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
