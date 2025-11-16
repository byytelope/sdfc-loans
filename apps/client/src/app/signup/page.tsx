"use client";

import Form from "next/form";
import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { signUpFormAction } from "@/lib/actions";
import { emptySignUpFormState } from "@/lib/definitions";

export default function SignUpPage() {
  const [formState, action, pending] = useActionState(
    signUpFormAction,
    emptySignUpFormState,
  );

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign Up</CardTitle>
          <CardDescription>
            Enter your details to use loan facilities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {formState.errors?.server && (
            <div className="mb-4">
              <FieldError>{formState.errors.server}</FieldError>
            </div>
          )}

          <Form action={action} id="signup-form">
            <FieldGroup>
              <Field data-invalid={!!formState.errors?.form?.name?.length}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  defaultValue={formState.values.name}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.form?.name?.length}
                  placeholder="Ahmed Ali"
                  autoComplete="name"
                />
                {formState.errors?.form?.name && (
                  <FieldError>{formState.errors?.form?.name[0]}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!formState.errors?.form?.email?.length}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={formState.values.email}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.form?.email?.length}
                  placeholder="yourmail@email.com"
                  autoComplete="email"
                />
                {formState.errors?.form?.email && (
                  <FieldError>{formState.errors?.form?.email[0]}</FieldError>
                )}
              </Field>

              <Field data-invalid={!!formState.errors?.form?.password?.length}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={formState.values.password}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.form?.password?.length}
                  autoComplete="new-password"
                />
                {formState.errors?.form?.password && (
                  <FieldError>{formState.errors?.form?.password[0]}</FieldError>
                )}
              </Field>

              <Field
                data-invalid={!!formState.errors?.form?.confirmPassword?.length}
              >
                <FieldLabel htmlFor="confirmPassword">
                  Confirm Password
                </FieldLabel>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  defaultValue={formState.values.confirmPassword}
                  disabled={pending}
                  aria-invalid={
                    !!formState.errors?.form?.confirmPassword?.length
                  }
                  autoComplete="new-password"
                />
                {formState.errors?.form?.confirmPassword && (
                  <FieldError>
                    {formState.errors?.form?.confirmPassword[0]}
                  </FieldError>
                )}
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" disabled={pending} form="signup-form">
              {pending && <Spinner />}
              Submit
            </Button>
            <FieldDescription className="text-center">
              Have an account? <Link href="/login">Log In</Link>
            </FieldDescription>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
