"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Github } from "lucide-react";
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

  const signInWithProvider = async (
    provider: "google" | "twitter" | "github",
  ) => {
    setError(null);
    setIsPending(true);

    try {
      await signIn(provider, { callbackUrl: "/dashboard" });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <Card className="border-border/60 bg-card/85 shadow-[0_30px_100px_-60px_rgba(0,0,0,0.85)] backdrop-blur">
      <CardHeader className="space-y-3">
        <CardTitle className="text-3xl">Sign in</CardTitle>
        <CardDescription className="leading-7">
          Access your PDF workspace, recent files, and editing sessions.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void signInWithProvider("google")}
              disabled={isPending}
            >
              Google
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void signInWithProvider("twitter")}
              disabled={isPending}
            >
              X
            </Button>
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => void signInWithProvider("github")}
              disabled={isPending}
            >
              <Github className="size-4" />
              GitHub
            </Button>
          </div>

          <div className="relative">
            <div className="h-px w-full bg-border/60" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border/70 bg-card px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Or continue with email
            </span>
          </div>

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
        </div>
      </CardContent>
    </Card>
  );
}
