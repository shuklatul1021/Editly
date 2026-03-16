"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useForm } from "react-hook-form";
import { SignInInput, signInSchema } from "@/lib/validations/auth";
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

export function SignInForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = form.handleSubmit((values) => {
    setError(null);
    setIsPending(true);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
        callbackUrl: "/dashboard",
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
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
        <CardTitle className="text-3xl">Sign in</CardTitle>
        <CardDescription className="leading-7">
          Access your PDF workspace, recent files, and editing sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-5" onSubmit={handleSubmit}>
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                href="/auth/sign-up"
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                Create account
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
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
            {isPending ? "Signing in..." : "Continue to dashboard"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
