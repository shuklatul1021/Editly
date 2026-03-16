"use client";

import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SignUpInput, signUpSchema } from "@/lib/validations/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    setError(null);
    setIsPending(true);

    startTransition(async () => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = (await response.json()) as { message?: string };

      if (!response.ok) {
        setError(payload.message ?? "Unable to create your account.");
        setIsPending(false);
        return;
      }

      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setError("Account created, but automatic sign-in failed.");
        setIsPending(false);
        return;
      }

      router.push(result.url ?? "/dashboard");
      router.refresh();
    });
  });

  return (
    <Card className="border-border/60 bg-card/85 shadow-[0_30px_100px_-60px_rgba(0,0,0,0.85)] backdrop-blur">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl">Create account</CardTitle>
        <CardDescription className="leading-7">
          Set up your workspace for uploading, editing, and exporting PDFs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              placeholder="Atul Sharma"
              {...form.register("name")}
            />
            {form.formState.errors.name ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.name.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@company.com"
              {...form.register("email")}
            />
            {form.formState.errors.email ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              {...form.register("password")}
            />
            {form.formState.errors.password ? (
              <p className="text-sm text-destructive">
                {form.formState.errors.password.message}
              </p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <Button
            type="submit"
            size="lg"
            className="w-full rounded-full"
            disabled={isPending}
          >
            {isPending ? "Creating account..." : "Create workspace"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
