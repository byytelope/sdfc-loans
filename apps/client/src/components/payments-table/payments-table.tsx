"use client";

import type { PaymentDetails } from "@sdfc-loans/types";

import { CreatePaymentDialog } from "@/components/create-payment-dialog";
import { DeletePaymentAlert } from "@/components/delete-payment-alert";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { currency } from "@/lib/utils";

export const PaymentsTable = ({
  isAdmin,
  paymentItems,
}: {
  isAdmin: boolean;
  paymentItems: PaymentDetails[];
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 w-full justify-end">
        <CreatePaymentDialog />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loan #</TableHead>
            <TableHead>Borrower</TableHead>
            <TableHead>Email</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead>Payment Date</TableHead>
            <TableHead>Recorded By</TableHead>
            <TableHead>Recorder Email</TableHead>
            <TableHead>Created</TableHead>
            {isAdmin && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentItems.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>{payment.loanNumber}</TableCell>
              <TableCell>{payment.borrowerName}</TableCell>
              <TableCell>{payment.borrowerEmail}</TableCell>
              <TableCell className="text-right">
                {currency.format(payment.amount)}
              </TableCell>
              <TableCell>
                {new Date(payment.paymentDate).toLocaleDateString()}
              </TableCell>
              <TableCell>{payment.recorderName}</TableCell>
              <TableCell>{payment.recorderEmail}</TableCell>
              <TableCell>
                {new Date(payment.createdAt).toLocaleString()}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-center flex justify-end gap-2">
                  <DeletePaymentAlert payment={payment} />
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
