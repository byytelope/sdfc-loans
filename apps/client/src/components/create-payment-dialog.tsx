"use client";

import type { LoanDetails } from "@sdfc-loans/types";
import { BanknoteArrowUpIcon, PlusIcon } from "lucide-react";
import Form from "next/form";
import { useActionState, useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPaymentFormAction, getLoans } from "@/lib/actions";
import { emptyPaymentFormState } from "@/lib/definitions";

export const CreatePaymentDialog = ({
  loanId,
  loanItems: initialLoanItems,
}: {
  loanId?: string;
  loanItems?: LoanDetails[];
}) => {
  const [formState, action, pending] = useActionState(
    createPaymentFormAction,
    emptyPaymentFormState,
  );
  const [open, setOpen] = useState(false);
  const [loans, setLoans] = useState<LoanDetails[]>(initialLoanItems ?? []);
  const [selectedLoan, setSelectedLoan] = useState<string | undefined>(
    loanId ?? formState.values.loanId,
  );

  useEffect(() => {
    if (initialLoanItems) setLoans(initialLoanItems);
  }, [initialLoanItems]);

  useEffect(() => {
    if (initialLoanItems) return;
    let mounted = true;
    (async () => {
      try {
        const res = await getLoans();
        if (mounted) setLoans(res.success ? res.data : []);
      } catch (err) {
        console.error("Failed to load loans", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [initialLoanItems]);

  useEffect(() => {
    if (loanId) {
      setSelectedLoan(loanId);
    }
  }, [loanId]);

  useEffect(() => {
    if (!loanId) {
      setSelectedLoan(formState.values.loanId);
    }
  }, [formState.values.loanId, loanId]);

  useEffect(() => {
    if (formState.success) {
      setOpen(false);
    }
  }, [formState.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {loanId ? (
          <Button size="icon-sm" variant="secondary" title="Record payment">
            <BanknoteArrowUpIcon />
          </Button>
        ) : (
          <Button>
            <PlusIcon />
            Create Payment
          </Button>
        )}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Payment</DialogTitle>
          <DialogDescription>Record a payment for a loan</DialogDescription>
        </DialogHeader>

        {formState.errors?.server && (
          <div className="mb-4">
            <FieldError>{formState.errors.server}</FieldError>
          </div>
        )}

        <Form action={action} id="create-payment-form">
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.form?.loanId?.length}>
              <FieldLabel htmlFor="loanId">Loan Number</FieldLabel>
              <Select
                value={loanId ?? selectedLoan}
                onValueChange={(v) => setSelectedLoan(v)}
                disabled={pending || loanId != null}
              >
                <SelectTrigger id="loanId" aria-label="Select loan">
                  <SelectValue placeholder="Select loan" />
                </SelectTrigger>
                <SelectContent>
                  {loans.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.loanNumber}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Hidden input so the form submits the loan id */}
              <input
                type="hidden"
                name="loanId"
                value={loanId ?? selectedLoan ?? ""}
              />

              {formState.errors?.form?.loanId && (
                <FieldError>{formState.errors.form.loanId[0]}</FieldError>
              )}
            </Field>

            <Field
              data-invalid={!!formState.errors?.form?.amount?.length}
              orientation="responsive"
            >
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                name="amount"
                type="number"
                defaultValue={formState.values.amount}
                disabled={pending}
                placeholder="0.00"
              />
              {formState.errors?.form?.amount && (
                <FieldError>{formState.errors.form.amount[0]}</FieldError>
              )}
            </Field>
          </FieldGroup>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost" disabled={pending}>
              Cancel
            </Button>
          </DialogClose>
          <Button form="create-payment-form" type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
