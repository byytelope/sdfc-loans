"use client";

import type { User } from "@sdfc-loans/types";
import { PlusIcon } from "lucide-react";
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
import { createLoanAction, getAllUsers } from "@/lib/actions";
import type { LoanItemBody } from "@/lib/definitions";

type LoanFormState = {
  values: LoanItemBody;
  errors: null | Record<string, string[]>;
  success: boolean;
};

const emptyLoanState: LoanFormState = {
  values: {} as LoanItemBody,
  errors: null,
  success: true,
};

export const CreateLoanDialog = () => {
  const [formState, action, pending] = useActionState(
    createLoanAction,
    emptyLoanState,
  );

  const [users, setUsers] = useState<User[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<string | undefined>(
    formState.values.borrower,
  );

  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getAllUsers();
        if (mounted) setUsers(res ?? []);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    setSelectedBorrower(formState.values.borrower);
  }, [formState.values.borrower]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusIcon />
          Create Loan
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create loan</DialogTitle>
          <DialogDescription>Add a new loan</DialogDescription>
        </DialogHeader>

        <Form action={action} id="create-loan-form">
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.loanNumber?.length}>
              <FieldLabel htmlFor="loanNumber">Loan Number</FieldLabel>
              <Input
                id="loanNumber"
                name="loanNumber"
                defaultValue={formState.values.loanNumber}
                disabled={pending}
              />
              {formState.errors?.loanNumber && (
                <FieldError>{formState.errors.loanNumber[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.borrower?.length}>
              <FieldLabel htmlFor="borrower">Borrower</FieldLabel>
              <Select
                value={selectedBorrower}
                onValueChange={(v) => setSelectedBorrower(v)}
                disabled={pending}
              >
                <SelectTrigger id="borrower" aria-label="Select borrower">
                  <SelectValue placeholder="Select borrower" />
                </SelectTrigger>
                <SelectContent>
                  {users.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} — {u.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Hidden input so the form submits the borrower id */}
              <input
                type="hidden"
                name="borrower"
                value={selectedBorrower ?? ""}
              />

              {formState.errors?.borrower && (
                <FieldError>{formState.errors.borrower[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.amount?.length}>
              <FieldLabel htmlFor="amount">Amount</FieldLabel>
              <Input
                id="amount"
                name="amount"
                type="number"
                defaultValue={formState.values.amount}
                disabled={pending}
                placeholder="0.00"
              />
              {formState.errors?.amount && (
                <FieldError>{formState.errors.amount[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.emi?.length}>
              <FieldLabel htmlFor="emi">EMI</FieldLabel>
              <Input
                id="emi"
                name="emi"
                type="number"
                defaultValue={formState.values.emi}
                disabled={pending}
                placeholder="0.00"
              />
              {formState.errors?.emi && (
                <FieldError>{formState.errors.emi[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.startDate?.length}>
              <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
              <Input
                id="startDate"
                name="startDate"
                disabled={pending}
                type="date"
              />
              {formState.errors?.startDate && (
                <FieldError>{formState.errors.startDate[0]}</FieldError>
              )}
            </Field>

            <Field data-invalid={!!formState.errors?.endDate?.length}>
              <FieldLabel htmlFor="endDate">End Date</FieldLabel>
              <Input
                id="endDate"
                name="endDate"
                disabled={pending}
                type="date"
              />
              {formState.errors?.endDate && (
                <FieldError>{formState.errors.endDate[0]}</FieldError>
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
          <Button form="create-loan-form" type="submit" disabled={pending}>
            {pending ? "Creating..." : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
