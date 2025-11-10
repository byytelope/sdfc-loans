"use client";

import Form from "next/form";
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { login } from "@/lib/actions";
import { emptyFormState } from "@/lib/definitions";

export default function LoginPage() {
  const [formState, action, pending] = useActionState(login, emptyFormState);

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Log in to access the dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <Form action={action} id="login-form">
            <FieldGroup>
              <Field
                data-invalid={
                  !!formState.errors?.email?.length ||
                  !!formState.errors?.password?.length
                }
              >
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={formState.values.email}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.email?.length}
                  placeholder="yourmail@email.com"
                  autoComplete="email"
                />
                {formState.errors?.email && (
                  <FieldError>{formState.errors?.email[0]}</FieldError>
                )}
              </Field>
              <Field data-invalid={!!formState.errors?.password?.length}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  defaultValue={formState.values.password}
                  disabled={pending}
                  aria-invalid={!!formState.errors?.password?.length}
                  autoComplete="current-password"
                />
                {formState.errors?.password && (
                  <FieldError>{formState.errors?.password[0]}</FieldError>
                )}
              </Field>
            </FieldGroup>
          </Form>
        </CardContent>
        <CardFooter>
          <Field>
            <Button type="submit" disabled={pending} form="login-form">
              {pending && <Spinner />}
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  );
}
