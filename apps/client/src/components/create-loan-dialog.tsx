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
import { createLoanFormAction, getUsers } from "@/lib/actions";
import { emptyLoanFormState } from "@/lib/definitions";

export const CreateLoanDialog = () => {
  const [formState, action, pending] = useActionState(
    createLoanFormAction,
    emptyLoanFormState,
  );
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedBorrower, setSelectedBorrower] = useState<string | undefined>(
    formState.values.borrower,
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getUsers();
        if (mounted) setUsers(res.success ? res.data : []);
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

  useEffect(() => {
    if (formState.success) {
      setOpen(false);
    }
  }, [formState.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon />
          Create Loan
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Loan</DialogTitle>
          <DialogDescription>Add a new loan</DialogDescription>
        </DialogHeader>

        {formState.errors?.server && (
          <div className="mb-4">
            <FieldError>{formState.errors.server}</FieldError>
          </div>
        )}

        <Form action={action} id="create-loan-form">
          <FieldGroup>
            <Field data-invalid={!!formState.errors?.form?.loanNumber?.length}>
              <FieldLabel htmlFor="loanNumber">Loan Number</FieldLabel>
              <Input
                id="loanNumber"
                name="loanNumber"
                defaultValue={formState.values.loanNumber}
                disabled={pending}
              />
              {formState.errors?.form?.loanNumber && (
                <FieldError>{formState.errors.form.loanNumber[0]}</FieldError>
              )}
            </Field>
            <Field data-invalid={!!formState.errors?.form?.borrower?.length}>
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

              {formState.errors?.form?.borrower && (
                <FieldError>{formState.errors.form.borrower[0]}</FieldError>
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

            <Field
              data-invalid={!!formState.errors?.form?.emi?.length}
              orientation="responsive"
            >
              <FieldLabel htmlFor="emi">EMI</FieldLabel>
              <Input
                id="emi"
                name="emi"
                type="number"
                defaultValue={formState.values.emi}
                disabled={pending}
                placeholder="0.00"
              />
              {formState.errors?.form?.emi && (
                <FieldError>{formState.errors.form.emi[0]}</FieldError>
              )}
            </Field>

            <Field
              data-invalid={!!formState.errors?.form?.startDate?.length}
              orientation="responsive"
            >
              <FieldLabel htmlFor="startDate">Start Date</FieldLabel>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                disabled={pending}
                defaultValue={formState.values.startDate}
              />

              {formState.errors?.form?.startDate && (
                <FieldError>{formState.errors.form.startDate[0]}</FieldError>
              )}
            </Field>

            <Field
              data-invalid={!!formState.errors?.form?.endDate?.length}
              orientation="responsive"
            >
              <FieldLabel htmlFor="endDate">End Date</FieldLabel>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                disabled={pending}
                defaultValue={formState.values.endDate}
              />
              {formState.errors?.form?.endDate && (
                <FieldError>{formState.errors.form.endDate[0]}</FieldError>
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
